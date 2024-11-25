// src/components/Board.jsx
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskList from './TaskList';

const Board = ({ tasks, setTasks }) => {
    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const updatedTasks = [...tasks];
        const sourceColumn = updatedTasks.find(column => column.id === source.droppableId);
        const destColumn = updatedTasks.find(column => column.id === destination.droppableId);
        
        const [movedTask] = sourceColumn.items.splice(source.index, 1);
        
        if (sourceColumn === destColumn) {
            sourceColumn.items.splice(destination.index, 0, movedTask);
        } else {
            destColumn.items.splice(destination.index, 0, movedTask);
        }
        
        setTasks(updatedTasks);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="board-container">
                {tasks.map((column) => (
                    <Droppable key={column.id} droppableId={column.id.toString()}>
                        {(provided) => (
                            <div
                                className='taskColumn'
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <h4>{column.title}</h4>
                                <TaskList tasks={column.items} columnId={column.id} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default Board;
