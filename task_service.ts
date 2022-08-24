
export type Task = {
	id: number;
	title: string;
	completed: boolean;
}

export class TaskInvalid extends Error {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, TaskInvalid.prototype);
	}
}

let tasks: Task[] = [
	{ id: 1, title: "Feed pets", completed: false }
]

export function getTaskById(id: number | undefined): Task | undefined {
	return tasks.find((task) => task.id == id)
}

export function getAllTasks(): Task[] {
	return tasks
}

export function deleteTaskById(id: number | undefined) {
	tasks = tasks.filter(task => task.id != id)
}

export function getNextId(): number {
	return Math.max(...tasks.map(task => task.id)) + 1
}

export function addTask({ title, completed }: Partial<Task>): Task {
	if (!title || title.length < 1) {
		throw new Error("property 'title' must be at least 1 character long")
	}

	const task: Task = {
		id: getNextId(),
		title: title,
		completed: !!completed
	}
	tasks.push(task)
	return task
}

export function updateTask({ id, title, completed }: Partial<Task>): Task | undefined {
	const task = getTaskById(id)
	if (!task) return

	if (!title || title.length < 1) {
		throw new Error("property 'title' must be at least 1 character long")
	}

	if (title) task.title = title
	if (completed !== undefined) task.completed = completed

	return task
}
