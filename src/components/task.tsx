// import { useState } from "react";
import { useTaskStore } from "../store/task-store";

type TaskProps = {
	from: string;
	text: string;
	id: number;
    done: boolean;
};

export default function Task({ from, text, id, done }: TaskProps) {

    // const [isDone, setIsDone] = useState(done)

	const removeTask = useTaskStore(state => state.removeTask)

	return (
		<div
			className="bg-slate-400 border-2 border-slate-400 w-full rounded-md px-2 py-1 flex justify-between items-center cursor-move hover:border-sky-500 relative"
			draggable
		>
            {done ? (
				<div className="absolute w-2 h-full bg-emerald-500 ml-auto left-0 rounded"></div>
			) : null}

            <p className="flex text-md capitalize ml-2">{text}</p>

			<button
				className="py-0.5 px-1.5 mx-1.5 my-0.5 bg-transparent"
				onClick={() => removeTask(from, id)}
			>
				<img
					src="/delete.svg"
					alt="delete icon"
					className="w-5 h-5 fill-red-500"
				/>
			</button>
        </div>
	)
}
