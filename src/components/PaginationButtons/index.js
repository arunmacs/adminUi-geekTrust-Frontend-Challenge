import "./index.css";

const PaginationButtons = (props) => {
  const { page } = props;

  const renderPageButtons = () => {
    console.log();
  };

  return (
    <li>
      <button type="button" className="page-button">
        {page}
      </button>
    </li>
  );
};

export default PaginationButtons;
