import "./index.css";

const FailureView = () => (
  <div className="no-data-view">
    <img
      src="https://image.freepik.com/free-vector/error-404-concept-landing-page_52683-18756.jpg"
      alt="Failure View"
      className="no-data-image"
    />
    <h2>Oops... Something Went Wrong, connection Lost</h2>
  </div>
);

export default FailureView;
