import React from "react";

const StateContext = React.createContext({
  checkAll: false,
  toggleCheckboxes: () => {},
  deleteUser: () => {},
  setPerPageUsers: () => {},
});

export default StateContext;
