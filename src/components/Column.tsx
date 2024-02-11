import React from "react";
import { useState } from "react";
import { useTaskStore } from "../store/task-store";

export default function Column({ title }: { title: string }) {
	const [showMenu, setShowMenu] = useState(false);

	// * changing the title
    const renameColumn = useTaskStore(state => state.renameColumn)
	const [showTitleForm, setShowTitleForm] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const handleSubmit = (e: React.FormEvent) => {
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
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
						/>
                        <button type="submit">C</button>
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
