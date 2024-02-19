/* eslint-disable react-hooks/rules-of-hooks */
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

// TODO: this
export function useImportData(json: JsonProps) {
    const addColumn = useTaskStore(state => state.addColumn)
	const addTask = useTaskStore(state => state.addTask)
	const toggleTask = useTaskStore(state => state.toggleTask)

    json.columnNames.map(clmn => {
		addColumn(clmn)
		json.columnTasks[clmn].tasks.map(task => {
			addTask(clmn, task.text, task.id)
			task.done && ( toggleTask(clmn, task.id) )
		})
	})

	return true
}