import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/task-store";
import AddTaskForm from "./add-task-form";
import Task from "./task";

export default function Column({ title }: { title: string }) {

	const [taskId, setTaskId] = useState(1)

	// * task-store functions
	const columnTasks = useTaskStore((state) => state.columnTasks);
	const addTask = useTaskStore(state => state.addTask)
	const removeTask = useTaskStore(state => state.removeTask)
	const toggleTask = useTaskStore(state => state.toggleTask)
	const renameColumn = useTaskStore((state) => state.renameColumn);

	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		let c = 1;
		columnTasks[title].tasks.map(task => {
			task.id = c++
		})
		setTaskId(c)
	}, [columnTasks, title])

	// * changing the title
	const [showTitleForm, setShowTitleForm] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const handleSubmit = (e: React.FormEvent) => {
		if (newTitle === "") return;
		e.preventDefault();
		renameColumn(title, newTitle);
		setNewTitle("");
		setShowTitleForm(false);
	};

	// * dropping a task
	const handleOnDrop = (e: React.DragEvent) => {
		
		const ItaskFrom = e.dataTransfer.getData('taskFrom')
		const ItaskText = e.dataTransfer.getData('taskText')
		const ItaskDone = e.dataTransfer.getData('taskDone')	
		const ItaskId = e.dataTransfer.getData('taskId')

		// * remove task from prev column
		removeTask(ItaskFrom, parseInt(ItaskId))

		// * add task to current column
		addTask(title, ItaskText, taskId)
		ItaskDone === 'true' && toggleTask(title, taskId);	
		setTaskId(i => ++i)

	}

	return (
		<div
			className="w-56 min-w-56 h-min bg-gray-700 flex flex-col py-4 px-4 rounded-lg gap-2"
			onDragOver={(e) =>  e.preventDefault()}
			onDrop={handleOnDrop}
		>
			<header className="flex justify-between items-center w-full relative">
				{showTitleForm ? (
					<form onSubmit={handleSubmit} className="flex gap-2">
						<input
							className="rounded-md font-mono text-sm w-32 py-1 px-4 outline-none"
							type="text"
							placeholder="New title ..."
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
						/>
						<button onClick={() => setShowTitleForm(false)}>
							<img src="/close.svg" alt="close icon" className="w-4 h-4" />
						</button>
					</form>
				) : (
					<h1 className="font-mono font-medium text-lg capitalize text-white" >
						{title}
					</h1>
				)}

				<button onClick={() => setShowMenu((sm) => !sm)}>
					<img src="/options.svg" alt="option icon" className="w-5 h-5" />
				</button>

				{showMenu && (
					<OptionsMenu from={title} closeMenu={setShowMenu} openForm={setShowTitleForm} />
				)}
			</header>

			{/* Task list */}
			<div className="flex flex-col w-full h-full gap-2">
				{columnTasks[title].tasks
					.sort((a, b) => (a.id > b.id ? 1 : -1))
					.map(task => {
						return (
							<Task
								from={title}
								text={task.text}
								id={task.id}
								done={task.done}
								key={task.id}
							/>
						);
					})}
			</div>

			{/* add task form */}
			<AddTaskForm from={title} taskId={taskId} setTaskId={setTaskId} />
		</div>
	);
}

function OptionsMenu({
	from,
	closeMenu,
	openForm
}: {
	from: string;
	closeMenu: React.Dispatch<React.SetStateAction<boolean>>;
	openForm: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const removeColumn = useTaskStore((state) => state.removeColumn);

	return (
		<div className="flex flex-col rounded-lg bg-slate-600 shadow-sm min-w-32 h-auto absolute top-8 right-0 py-2 px-4 z-20 gap-2">
			<button
				className="flex justify-between items-center px-2"
				onClick={() => {
					removeColumn(from);
					closeMenu(false);
				}}
			>
				<p className="text-sm">Delete</p>
				<img className="h-4 w-4" src="/delete.svg" alt="" />
			</button>
			<button
				className="flex justify-between items-center px-2"
				onClick={() => {
					openForm(true)
					closeMenu(false);
				}}
			>
				<p className="text-sm">Edit</p>
				<img className="h-4 w-4" src="/edit.svg" alt="" />
			</button>
		</div>
	);
}
