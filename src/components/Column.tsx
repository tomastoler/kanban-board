import React from "react";
import { useState } from "react";
import { useTaskStore } from "../store/task-store";
import AddTaskForm from "./add-task-form";
import Task from "./task";

export default function Column({ title }: { title: string }) {
	const [showMenu, setShowMenu] = useState(false);

	// * changing the title
    const renameColumn = useTaskStore(state => state.renameColumn)
	const columnTasks = useTaskStore(state => state.columnTasks)

	const [showTitleForm, setShowTitleForm] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const handleSubmit = (e: React.FormEvent) => {
		if (newTitle === '') return
		e.preventDefault();
        renameColumn(title, newTitle)
		setNewTitle("");
        setShowTitleForm(false)
	};

	return (
		<div className="w-72 min-w-72 h-min bg-gray-700 flex flex-col py-4 px-4 rounded-lg gap-2">
			<header className="flex justify-between items-center w-full relative">
				{showTitleForm ? (
					<form onSubmit={handleSubmit} className="flex">
						<input
							className="outline-sky-400 rounded-md font-mono text-sm py-1 px-4"
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
						/>
                        {/* <button type="submit">C</button> */}
					</form>
				) : (
					<h1
						className="font-mono font-medium text-xl capitalize text-white"
						onDoubleClick={() => setShowTitleForm(true)}
					>
						{title}
					</h1>
				)}

				<button onClick={() => setShowMenu((sm) => !sm)}>
					<img src="/options.svg" alt="option icon" />
				</button>

				{showMenu && (
					<OptionsMenu from={title} closeMenu={setShowMenu} />
				)}
			</header>

			{/* Task list */}
			<div className="flex flex-col w-full h-full gap-2">
					{columnTasks[title].tasks
						.sort((a, b) => a.id > b.id ? 1 : -1)
						.map(task => {
							return <Task from={title} text={task.text} id={task.id} done={task.done} key={task.id} />
						})
					}
			</div>

			{/* add task form */}
			<AddTaskForm from={title} />

		</div>
	);
}

function OptionsMenu({
	from,
	closeMenu,
}: {
	from: string;
	closeMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const removeColumn = useTaskStore((state) => state.removeColumn);

	return (
		<div className="flex flex-col rounded-lg bg-slate-600 shadow-sm min-w-32 h-auto absolute top-8 right-0 py-2 px-4 z-20">
			<button
				className="flex justify-between items-center px-2"
				onClick={() => {
					removeColumn(from);
					closeMenu(false);
				}}
			>
				<p className="text-sm">Delete</p>
				<img className="h-5 w-5" src="/delete.svg" alt="" />
			</button>
		</div>
	);
}
