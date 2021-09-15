import React from "react";

const StateContext = React.createContext({
  checkAll: false,
  toggleCheckboxes: () => {},
  deleteUser: () => {},
  setPerPageUsers: () => {},
  all:0;
});

export default StateContext;
