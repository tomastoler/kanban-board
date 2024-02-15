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
	removeTask: (column: string, idtask: number) => void;
	toggleTask: (column: string, idtask: number) => void;
}

export const useTaskStore = create<ITaskStore>()(
	persist(
		(set, get) => ({
			columnNames: [],
			columnTasks: {},

			// * <Column> add a column
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
			// * <Column> remove a column
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

			// * <Column> remane a column
			renameColumn: (oldColumn, newColumn) => {
				const { columnTasks, removeColumn } = get();
				columnTasks[newColumn] = {
					id: columnTasks[oldColumn].id,
					tasks: columnTasks[oldColumn].tasks,
				};
				removeColumn(oldColumn);

				set(() => ({
					columnNames: [
						...Object.entries(columnTasks)
							.sort((c1, c2) =>
								c1[1].id > c2[1].id
									? 1
									: c1[1].id < c2[1].id
									? -1
									: 0
							)
							.map((c) => c[0]),
					],
					columnTasks,
				}));
			},

			// * <Task> add a task to a column [done->false]
			addTask: (column, texttask, idtask) => {
				const { columnNames } = get();

				set((state) => ({
					columnNames,
					columnTasks: {
						...state.columnTasks,
						[column.toLowerCase()]: {
							id: state.columnTasks[column].id,
							tasks: [
								...state.columnTasks[column].tasks,
								{
									id: idtask,
									text: texttask,
									done: false,
								},
							],
						},
					},
				}));
			},

			// * <Task> remove a task froma column
			removeTask: (column, idtask) => {
				const { columnNames } = get();

				set(state => ({
					columnNames,
					columnTasks: {
						...state.columnTasks,
						[column.toLowerCase()]: {
							id: state.columnTasks[column].id,
							tasks: [...state.columnTasks[column].tasks.filter(t => t.id !== idtask)]
						}
					}
				}));
			},

			// * <Task> toggle {done} of a task
			toggleTask: (column, idtask) => {
				const { columnNames } = get();

				set(state => ({
					columnNames,
					columnTasks: {
						...state.columnTasks,
						[column]: {
							id: state.columnTasks[column].id,
							tasks: [...state.columnTasks[column].tasks.filter(t => t.id !== idtask ), {
								id: idtask,
								text: state.columnTasks[column].tasks.find(t => t.id === idtask)!.text,
								done: !state.columnTasks[column].tasks.find(t => t.id === idtask)!.done
							} ]
						}
					}
				}))

			}
		}),
		{
			name: "task-store",
		}
	)
);