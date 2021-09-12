import { Component } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import UserRow from "../src/components/UserRow";
import PaginationButtons from "../src/components/PaginationButtons";
import "./App.css";

class App extends Component {
  state = { usersData: [], perPageUsers: [] };

  componentDidMount() {
    this.getUsersData();
  }

  getUsersData = async () => {
    const apiUrl =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

    const options = {
      method: "GET",
      ContentType: "application/json",
    };

    const response = await fetch(apiUrl, options);

    if (response.ok) {
      const data = await response.json();
      console.log(data, "Json Response");

      this.setState({ usersData: data, perPageUsers: data.slice(0, 10) });
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

  renderSearchBar = () => (
    <div className="search-container">
      <input
        type="search"
        className="search-input"
        placeholder="Search by name,email or role"
      />
    </div>
  );

  renderTable = () => {
    const { perPageUsers } = this.state;

    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="column-header">
                <input
                  type="checkbox"
                  id="header-checkbox"
                  className="column-checkbox"
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
              <UserRow user={user} key={user.id} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    const { usersData } = this.state;
    const pageArrays = this.getNumberOfPages();
    console.log(pageArrays, "pageNumbers");

    return (
      <div className="app">
        <header className="app-header">
          <h1 className="header-heading">Admin UI</h1>
        </header>
        <section className="app-body-section">
          {this.renderSearchBar()}
          {this.renderTable()}
        </section>
        <footer>
          <button type="button" className="delete-selected">
            Delete Selected
          </button>
          <ul className="pagination-buttons-container">
            <button type="button" className="next-prev-buttons">
              <GrPrevious />
            </button>
            {pageArrays.map((page) => (
              <PaginationButtons key={page} page={page} />
            ))}
            <button type="button" className="next-prev-buttons">
              <GrNext />
            </button>
          </ul>
        </footer>
      </div>
    );
  }
}

export default App;
