import React from "react";


import TaskList from "./TaskList";
// import { TASKS } from "./json";
import "./kanban.css";

function Kanban(props) {
  return (
      <TaskList {...props} />
  );
}

export default Kanban

