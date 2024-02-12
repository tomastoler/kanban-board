import AddColumnForm from "../components/add-column-form";
import Column from "../components/column";
import { useTaskStore } from "../store/task-store";

export default function HomePage() {

    const columnNames = useTaskStore(state => state.columnNames)

	return (
		<main className="w-full h-full flex gap-4 px-20 py-10 overflow-x-scroll">
            {columnNames
                .map(column => {
                return <Column key={column} title={column} />
            })}

            <AddColumnForm />
		</main>
	);
}
