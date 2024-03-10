// import { useState } from "react";
import { useState } from "react";
import { useTaskStore } from "../store/task-store";

type TaskProps = {
	from: string;
	text: string;
	id: number;
	done: boolean;
};

export default function Task({ from, text, id, done }: TaskProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [newText, setNewText] = useState("");

	const removeTask = useTaskStore((state) => state.removeTask);
	const toggleTask = useTaskStore((state) => state.toggleTask);
	const renameTask = useTaskStore((state) => state.renameTask);

	const handleOnDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("taskFrom", from);
		e.dataTransfer.setData("taskId", id + "");
		e.dataTransfer.setData("taskText", text);
		e.dataTransfer.setData("taskDone", done + "");
	};

	return (
		<div
			className="bg-slate-400 border-2 border-slate-400 w-full rounded-md px-2 py-1 flex justify-between items-center cursor-move hover:border-sky-500 relative"
			onDoubleClick={() => toggleTask(from, id)}
			onDragStart={handleOnDragStart}
			draggable
		>
			{done ? (
				<div className="absolute w-2 h-full bg-emerald-500 ml-auto left-0 rounded"></div>
			) : null}

			{!isEditing ? (
				<p className="flex text-md capitalize ml-2">{text}</p>
			) : (
				<form onSubmit={() => renameTask(from, id, newText)}>
					<input
						type="text"
						placeholder="new text ..."
						className="rounded px-1 w-40"
						value={newText}
						onChange={(e) => setNewText(e.target.value)}
					/>
				</form>
			)}

			<div className="flex">
				<TaskButton onClick={() => setIsEditing((s) => !s)}>
					<img src="/edit.svg" alt="edit icon" className="w-5 h-5" />
				</TaskButton>
				<TaskButton onClick={() => removeTask(from, id)}>
					<img
						src="/delete.svg"
						alt="delete icon"
						className="w-5 h-5"
					/>
				</TaskButton>
			</div>
		</div>
	);
}

function TaskButton({ children, ...props }) {
	return (
		<button className="py-0.5 px-1.5 my-0.5 bg-transparent" {...props}>
			{children}
		</button>
	);
}
