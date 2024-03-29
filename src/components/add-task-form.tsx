import React from "react";
import { useState } from "react";
import { useTaskStore } from "../store/task-store";

type AddTaskFormProps = {
	from: string;
	taskId: number;
	setTaskId: React.Dispatch<React.SetStateAction<number>>;
};

export default function AddTaskForm({
	from,
	taskId,
	setTaskId,
}: AddTaskFormProps) {
	const addTask = useTaskStore((state) => state.addTask);

	const [newTask, setNewTask] = useState("");
	// const [idTask, setIdTask] = useState(1);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addTask(from, newTask, taskId);
		setTaskId(++taskId);
		setNewTask("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 h-7">
			<input
				type="text"
				value={newTask}
				className="w-2/3 h-full rounded-lg outline-none px-2 text-sm"
				onChange={(e) => setNewTask(e.target.value)}
			/>
			<button
				type="submit"
				className="w-1/3 h-full rounded-lg bg-blue-400 text-sm"
			>
				Add
			</button>
		</form>
	);
}
