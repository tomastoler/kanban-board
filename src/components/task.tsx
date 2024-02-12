import { useState } from "react";

type TaskProps = {
	from: string;
	text: string;
	id: number;
    done: boolean;
};

export default function Task({ from, text, id, done }: TaskProps) {

    const [isDone, setIsDone] = useState(done)

	return (
		<div
			className="bg-slate-400 border-2 border-slate-400 w-full rounded-md px-2 py-1 flex justify-between items-center cursor-move hover:border-sky-500 relative"
			draggable
		>
            {isDone ? (
				<div className="absolute w-2 h-full bg-emerald-500 ml-auto left-0 rounded"></div>
			) : null}

            <p className="flex text-md capitalize ml-2">{text}</p>
        </div>
	)
}
