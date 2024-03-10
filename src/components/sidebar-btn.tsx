import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/task-store";

type TTask = {
	id: number;
	text: string;
	done: boolean;
};

type JsonProps = {
    columnNames: string[];
	columnTasks: {
		[columnName: string]: {
			id: number;
			tasks: TTask[];
		};
	};
}

export default function SidebarBtn() {
	const [showSidebar, setShowSidebar] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [file, setFile] = useState<File | null>();

	const columnNames = useTaskStore((state) => state.columnNames);
	const columnTasks = useTaskStore((state) => state.columnTasks);
	const addColumn = useTaskStore((state) => state.addColumn);
	const addTask = useTaskStore((state) => state.addTask);
	const toggleTask = useTaskStore((state) => state.toggleTask);

	useEffect(() => {
		setShowForm(false)
	}, [showSidebar])

	const handleExport = () => {
		const data = `data:text/json;charset=utf-8,${encodeURIComponent(
			JSON.stringify({
				columnNames,
				columnTasks,
			})
		)}`;

		const l = document.createElement("a");
		l.href = data;
		l.download = "data.json";
		l.click();
	};

	const handleImport = (json: JsonProps) => {
		json.columnNames.map((clmn) => {
			addColumn(clmn);
			json.columnTasks[clmn].tasks.map((task) => {
				addTask(clmn, task.text, task.id);
				task.done && toggleTask(clmn, task.id);
			});
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		file?.text().then((data) => {
			handleImport(JSON.parse(data));
		});
		setShowForm(false)
	};

	return (
		<>
			<button
				className="absolute top-10 right-20"
				onClick={() => setShowSidebar(true)}
			>
				<img src="/options.svg" alt="options" />
			</button>

			{showSidebar && (
				<aside className="absolute flex flex-col top-0 right-0 rounded-tl-2xl rounded-bl-2xl h-full w-96 bg-gray-700">
					<div className="w-full h-full relative flex flex-col justify-end items-center">
						{/* close button */}
						<button
							className="absolute top-8 left-10"
							onClick={() => setShowSidebar(false)}
						>
							<img
								src="/close.svg"
								className="w-7 h-7"
								alt="close"
							/>
						</button>

						{showForm && (
							<form
								className="flex flex-col absolute bg-slate-300 rounded-xl -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
								onSubmit={handleSubmit}
							>
								<input
									type="file"
									className="h-64 w-64 rounded-xl m-2 p-2 flex justify-center items-center border-2 border-white border-dashed"
									placeholder="Drag your file"
									onChange={(e) =>
										setFile(
											e.target.files && e.target.files[0]
										)
									}
								/>
								<button
									type="submit"
									className="py-1 px-4 mr-0 w-min capitalize text-center rounded-full bg-sky-400"
								>
									upload
								</button>
							</form>
						)}

						<footer className="w-full flex gap-2 px-2 py-2">
							<FButton f={handleExport}>Export</FButton>
							<FButton f={() => setShowForm((f) => !f)}>
								Import
							</FButton>
						</footer>
					</div>
				</aside>
			)}
		</>
	);
}

type FButtonProps = {
	children: string | React.ReactElement;
	f?: () => void;
};

function FButton({ children, f }: FButtonProps) {
	return (
		<button
			className="py-2 w-full rounded-xl text-center bg-slate-400 hover:bg-slate-300"
			onClick={f}
		>
			{children}
		</button>
	);
}
