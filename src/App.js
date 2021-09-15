import { Component } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { ImNext2, ImPrevious2 } from "react-icons/im";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import UserRow from "../src/components/UserRow";
import PaginationButtons from "../src/components/PaginationButtons";
import "./App.css";

const viewStatus = {
  initial: "INITIAL",
  inProgress: "INPROGRESS",
  dataView: "SUCCESS",
  noDataView: "NODATA",
  failure: "FAILURE",
};

class App extends Component {
  state = {
    dataViewStatus: viewStatus.initial,
    masterCopyUsersData: [],
    usersData: [],
    perPageUsers: [],
    search: "",
    checkAll: false,
    selectedButton: 1,
  };

  componentDidMount() {
    this.getUsersData();
  }

  getUsersData = async () => {
    this.setState({ dataViewStatus: viewStatus.inProgress });
    const apiUrl =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

    const options = {
      method: "GET",
      ContentType: "application/json",
    };

    const response = await fetch(apiUrl, options);

    if (response.ok) {
      const data = await response.json();

      const formattedData = data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role,
        checked: false,
      }));

      this.setState({
        masterCopyUsersData: formattedData,
        usersData: formattedData,
        perPageUsers: formattedData.slice(0, 10),
        dataViewStatus: viewStatus.dataView,
      });
    } else {
      this.setState({ dataViewStatus: viewStatus.failure });
    }
  };

  getNumberOfPages = () => {
    const { usersData } = this.state;
    const pageNumbers = [];
    for (let i = 1; i < Math.ceil(usersData.length / 10 + 1); i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  setPerPageUsers = (page) => {
    const { usersData } = this.state;
    const startIndex = page * 10 - 10;
    const endIndex = startIndex + 10;

    this.setState({
      perPageUsers: usersData.slice(startIndex, endIndex),
      selectedButton: page,
      checkAll: false,
    });
  };

  toggleCheckboxes = () => {
    this.setState((prevState) => ({
      perPageUsers: prevState.perPageUsers.map((user) => {
        if (user.checked) {
          return { ...user, checked: false };
        }
        return { ...user, checked: true };
      }),
      checkAll: !prevState.checkAll,
    }));
  };

  toggleCheckbox = (id) => {
    this.setState((prevState) => ({
      perPageUsers: prevState.perPageUsers.map((user) => {
        if (user.id === id) {
          return { ...user, checked: !user.checked };
        }
        return user;
      }),
    }));
  };

  deleteUser = (id) => {
    this.setState((prevState) => ({
      perPageUsers: prevState.perPageUsers.filter((user) => user.id !== id),
    }));
  };

  deleteSelectedUsers = () => {
    const { checkAll } = this.state;

    checkAll && this.setState({ perPageUsers: [], checkAll: false });
  };

  changeSearchQuery = (event) => {
    this.setState({ search: event.target.value });
  };

  enterSearchQuery = (event) => {
    const { search, masterCopyUsersData } = this.state;

    if (event.key === "Enter") {
      const searchResultData = masterCopyUsersData.filter((user) => {
        const userName = user.name.toLowerCase().includes(search.toLowerCase());
        const userEmail = user.email
          .toLowerCase()
          .includes(search.toLowerCase());
        const userRole = user.role.toLowerCase().includes(search.toLowerCase());

        if (userName || userEmail || userRole) {
          return user;
        }
        return null;
      });

      console.log(searchResultData);

      this.setState({
        usersData: searchResultData,
        perPageUsers: searchResultData.slice(0, 10),
        search: "",
      });
    }
  };

  renderSearchBar = () => {
    const { search } = this.state;

    return (
      <div className="search-container">
        <input
          type="search"
          value={search}
          onChange={this.changeSearchQuery}
          onKeyDown={this.enterSearchQuery}
          className="search-input"
          placeholder="Search by name,email or role"
        />
      </div>
    );
  };

  renderTable = () => {
    const { perPageUsers, checkAll } = this.state;

    return (
      <>
        <div className="table-container">
          <table>
            <thead>
              <tr className="table-header">
                <th className="column-header">
                  <input
                    type="checkbox"
                    id="header-checkbox"
                    className="column-checkbox"
                    onChange={this.toggleCheckboxes}
                    checked={checkAll}
                  />
                </th>
                <th className="column-header">Name</th>
                <th className="column-header">Email</th>
                <th className="column-header">Role</th>
                <th className="column-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {perPageUsers.map((user) => (
                <UserRow
                  user={user}
                  toggleCheckbox={this.toggleCheckbox}
                  deleteUser={this.deleteUser}
                  key={user.id}
                />
              ))}
            </tbody>
          </table>
        </div>
        {this.renderFooterSection()}
      </>
    );
  };

  renderFooterSection = () => {
    const { selectedButton } = this.state;

    const pageArrays = this.getNumberOfPages();

    return (
      <footer>
        <button
          type="button"
          onClick={this.deleteSelectedUsers}
          className="delete-selected"
        >
          Delete Selected
        </button>
        <ul className="pagination-buttons-container">
          <button type="button" className="next-prev-buttons">
            <ImPrevious2 />
          </button>
          <button type="button" className="next-prev-buttons">
            <GrPrevious />
          </button>
          {pageArrays.map((page) => (
            <PaginationButtons
              key={page}
              setPerPageUsers={this.setPerPageUsers}
              isActive={selectedButton === page}
              page={page}
            />
          ))}
          <button type="button" className="next-prev-buttons">
            <GrNext />
          </button>
          <button type="button" className="next-prev-buttons">
            <ImNext2 />
          </button>
        </ul>
      </footer>
    );
  };

  getStatusView = () => {
    const { dataViewStatus, perPageUsers } = this.state;

    switch (dataViewStatus) {
      case viewStatus.inProgress:
        return this.renderLoaderAnimation();
      case viewStatus.dataView:
        return perPageUsers.length !== 0
          ? this.renderTable()
          : this.renderNoDataView();
      case viewStatus.noDataView:
        return this.renderNoDataView();
      case viewStatus.failure:
        return this.renderFailureView();
      default:
        return null;
    }
  };

  renderLoaderAnimation = () => (
    <div className="loader">
      <Loader
        type="Oval"
        className="loader"
        color="#00bfff"
        height={80}
        width={80}
      />
    </div>
  );

  renderNoDataView = () => {
    console.log();

    return (
      <div className="no-data-view">
        <img
          src="https://image.freepik.com/free-vector/no-data-concept-illustration_114360-695.jpg"
          alt="No Data View"
          className="no-data-image"
        />
        <h2>No, Data Found</h2>
      </div>
    );
  };

  renderFailureView = () => {
    console.log();

    return (
      <div className="no-data-view">
        <img
          src="https://image.freepik.com/free-vector/error-404-concept-landing-page_52683-18756.jpg"
          alt="Failure View"
          className="no-data-image"
        />
        <h2>Oops... Something Went Wrong, connection Lost</h2>
      </div>
    );
  };

  render() {
    const { usersData, perPageUsers, search } = this.state;
    console.log("Render");

    return (
      <div className="app">
        <header className="app-header">
          <h1 className="header-heading">Admin UI</h1>
        </header>
        <section className="app-body-section">
          {this.renderSearchBar()}
          {this.getStatusView()}
        </section>
      </div>
    );
  }
}

export default App;
