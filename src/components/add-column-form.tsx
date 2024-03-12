import React from "react";
import { useState } from "react";
import { useTaskStore } from "../store/task-store";

export default function AddColumnForm() {

	const [column, setColumn] = useState("");

    const addColumn = useTaskStore(state => state.addColumn)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // * add column to new state
        addColumn(column)
        setColumn('')
    }

    return (
		<form className="flex flex-col w-48 gap-2" onSubmit={handleSubmit}>
			<input
				type="text"
				className="rounded-md font-mono text-sm py-1 px-4 outline-none"
				placeholder="Add a column ..."
                value={column}
                onChange={e => setColumn(e.target.value)}
			/>
			<button
				type="submit"
				className="py-2 px-6 rounded-md bg-slate-100 opacity-80 text-sm"
			>
				Add Column
			</button>
		</form>
	);
}
