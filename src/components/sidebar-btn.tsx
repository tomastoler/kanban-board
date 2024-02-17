import React, { useState } from "react";
import { useTaskStore } from "../store/task-store";

export default function SidebarBtn() {
	const [showSidebar, setShowSidebar] = useState(false);

	const columnNames = useTaskStore(state => state.columnNames)
	const columnTasks = useTaskStore(state => state.columnTasks)

	const handleExport = () => {
		const data = `data:text/json;charset=utf-8,${encodeURIComponent(
			JSON.stringify({
				columnNames,columnTasks
			})
		)}`
		const l = document.createElement('a')
		l.href = data
		l.download = 'data.json'
		l.click()
	}

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
					<div className="w-full h-full relative flex flex-col justify-end">
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

						<footer className="w-full flex gap-2 px-2 py-2">
							<FButton f={handleExport} >Export</FButton>
							<FButton>Import</FButton>
						</footer>
					</div>
				</aside>
			)}
		</>
	);
}

type FButtonProps = {
	children: string | React.ReactElement;
	f?: () => void 
};

function FButton({ children, f }: FButtonProps) {
	return (
		<button className="py-2 w-full rounded-xl text-center bg-slate-400 hover:bg-slate-300" onClick={f}>
			{children}
		</button>
	);
}
