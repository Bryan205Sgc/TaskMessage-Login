// const [tasks, setTasks] = useState({});
//     const [columns, setColumns] = useState({
//         todo: { title: "No Iniciada", taskIds: [] },
//         inProgress: { title: "En progreso", taskIds: [] },
//         done: { title: "Finalizada", taskIds: [] },
//     });

//     useEffect(() => {
//         const fetchTasks = async () => {
//             const response = await fetch("http://localhost:4000/api/v1/task");
//             const data = await response.json();
//             console.log(data);

//             const taskMap = {};
//             const columnMap = { todo: [], inProgress: [], done: [] };

//             data.tasks.forEach((task) => {
//                 const id = task._id;
//                 taskMap[id] = {
//                     id,
//                     title: task.nombre,
//                     description: task.descripcion,
//                     progresion: task.progresion,
//                 };

//                 switch (task.progresion) {
//                     case "No Iniciada":
//                         columnMap.todo.push(id);
//                         break;
//                     case "En progreso":
//                         columnMap.inProgress.push(id);
//                         break;
//                     case "Finalizada":
//                         columnMap.done.push(id);
//                         break;
//                     default:
//                         break;
//                 }
//             });

//             setTasks(taskMap);
//             setColumns((prevColumns) => ({
//                 ...prevColumns,
//                 todo: { ...prevColumns.todo, taskIds: columnMap.todo },
//                 inProgress: { ...prevColumns.inProgress, taskIds: columnMap.inProgress },
//                 done: { ...prevColumns.done, taskIds: columnMap.done },
//             }));
//         };

//         fetchTasks();
//     }, []);

//     const onDragEnd = async (event) => {
//         const { active, over } = event;

//         if (!over) return;

//         const sourceColumn = Object.keys(columns).find((key) =>
//             columns[key].taskIds.includes(active.id)
//         );
//         const destinationColumn = over.id;

//         if (sourceColumn !== destinationColumn) {
//             // Update the progression of the task based on the destination column
//             let newProgression = "";
//             switch (destinationColumn) {
//                 case "todo":
//                     newProgression = "No Iniciada";
//                     break;
//                 case "inProgress":
//                     newProgression = "En progreso";
//                     break;
//                 case "done":
//                     newProgression = "Finalizada";
//                     break;
//                 default:
//                     break;
//             }

//             // Make API request to update the task's progression
//             const taskId = active.id;
//             await fetch(`http://localhost:4000/api/v1/task/${taskId}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ progresion: newProgression }),
//             });

//             // Update columns and tasks locally after the task is moved
//             setColumns((prevColumns) => {
//                 const sourceTaskIds = [...prevColumns[sourceColumn].taskIds];
//                 const destinationTaskIds = [...prevColumns[destinationColumn].taskIds];

//                 sourceTaskIds.splice(sourceTaskIds.indexOf(active.id), 1);
//                 destinationTaskIds.push(active.id);

//                 return {
//                     ...prevColumns,
//                     [sourceColumn]: { ...prevColumns[sourceColumn], taskIds: sourceTaskIds },
//                     [destinationColumn]: {
//                         ...prevColumns[destinationColumn],
//                         taskIds: destinationTaskIds,
//                     },
//                 };
//             });

//             // Update task's local state with new progression
//             setTasks((prevTasks) => ({
//                 ...prevTasks,
//                 [active.id]: {
//                     ...prevTasks[active.id],
//                     progresion: newProgression,
//                 },
//             }));
//         }
//     };

//     return (
//         <DndContext onDragEnd={onDragEnd}>
//             <div className="App">
//                 <h1>Task Manager</h1>
//                 <div className="board">
//                     {Object.entries(columns).map(([columnId, column]) => (
//                         <Column
//                             key={columnId}
//                             title={column.title}
//                             tasks={column.taskIds.map((taskId) => tasks[taskId])}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </DndContext>
//     );