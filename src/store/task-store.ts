import { create } from "zustand";
import { persist } from "zustand/middleware";

let columnCount: number = 0;

type TTask = {
	id: number;
	text: string;
	done: boolean;
};

interface ITaskStore {
	columnNames: string[];
	columnTasks: {
		[columnName: string]: {
			id: number;
			tasks: TTask[];
		};
	};
	addColumn: (newColumn: string) => void;
	removeColumn: (oldColumn: string) => void;
	renameColumn: (oldColumn: string, newColumn: string) => void;
	addTask: (column: string, texttask: string, idtask: number) => void;
}

export const useTaskStore = create<ITaskStore>()(
	persist(
		(set, get) => ({
			columnNames: [],
			columnTasks: {},

			// * add a column
			addColumn: (newColumn) => {
				const { columnNames } = get();

				if (
					!columnNames.some((c) => c === newColumn) &&
					newColumn !== ""
				) {
					set((state) => ({
						columnNames: [
							...state.columnNames,
							newColumn.toLowerCase(),
						],
						columnTasks: {
							...state.columnTasks,
							[newColumn.toLowerCase()]: {
								id: columnCount++,
								tasks: [],
							},
						},
					}));
				}
			},
			// * remove a column
			removeColumn: (oldColumn) => {
				if (oldColumn === "") return;

				const { columnTasks } = get();
				delete columnTasks[oldColumn];

				set((state) => ({
					columnNames: state.columnNames.filter(
						(c) => c !== oldColumn
					),
					oldColumn,
					columnTasks,
				}));
			},

			// * remane a column
			renameColumn: (oldColumn, newColumn) => {
				const { columnTasks, removeColumn } = get();
				columnTasks[newColumn] = {
					id: columnTasks[oldColumn].id,
					tasks: columnTasks[oldColumn].tasks,
				};
				removeColumn(oldColumn);

				set(() => ({
					columnNames: [...Object.entries(columnTasks).sort((c1, c2) =>
						c1[1].id > c2[1].id ? 1 : c1[1].id < c2[1].id ? -1 : 0
					).map(c => c[0])],
					columnTasks
				}));
			},

			// * add a task to a column [done->false]
			addTask: (column, texttask, idtask) => {

				const { columnNames, columnTasks } = get()

				console.log(columnTasks);
				console.log(columnTasks[column]);
				

				columnTasks[column.toLowerCase()].tasks.push({
					id: idtask,
					text: texttask,
					done: false
				})

				set(() => ({
					columnNames,
					columnTasks
				}))
			}
		}),
		{
			name: "task-store",
		}
	)
);
