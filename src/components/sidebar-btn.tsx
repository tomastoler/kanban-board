import { useState } from "react";

export default function SidebarBtn() {
	const [showSidebar, setShowSidebar] = useState(false);

	return (
		<>
			<button
				className="absolute top-10 right-20"
				onClick={() => setShowSidebar(true)}
			>
				<img src="/options.svg" alt="options" />
			</button>

			{showSidebar && (
				<aside className="absolute flex flex-col top-0 right-0 rounded-tl-2xl rounded-bl-2xl h-full w-96 bg-slate-500">
					<div className="w-full h-full relative">
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
					</div>
				</aside>
			)}
		</>
	);
}
