import "./index.css";

const PaginationButtons = (props) => {
  const { page, setPerPageUsers, isActive } = props;

  const buttonSelected = isActive ? "selected-button" : "";

  const renderPageButtons = () => {
    setPerPageUsers(page);
  };

  return (
    <li>
      <button
        type="button"
        onClick={renderPageButtons}
        className={`page-button ${buttonSelected}`}
      >
        {page}
      </button>
    </li>
  );
};

export default PaginationButtons;
