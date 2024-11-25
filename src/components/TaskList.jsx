import React from 'react';
import Task from './Task';

const TaskList = ({ tasks }) => (
    <div>
        {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} />
        ))}
    </div>
);

export default TaskList;
