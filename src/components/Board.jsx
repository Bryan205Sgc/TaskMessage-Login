import React from "react";
import Column from "./Column";

const Board = ({ column }) => {
  return (
    <div className="board">
      <Column title={column.title} tasks={column.tasks} />
    </div>
  );
};

export default Board;
