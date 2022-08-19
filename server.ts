import Fastify, { FastifyRequest } from 'fastify'
import { readFileSync } from 'fs';

const fastify = Fastify({
	logger: true
})

type Task = {
	id: number;
	title: string;
	completed: boolean;
}

type TaskValidationResult = {
	errors: string[];
	task?: Task;
}

let tasks: Task[] = [
	{ id: 1, title: "Feed pets", completed: false }
]

fastify.get('/', async (request, response) => {
	response.type('text/html').send(readFileSync('index.html'))
})

fastify.get('/tasks', async (request, response) => {
	response.send(tasks)
})

fastify.get('/task/:taskId', async (request: FastifyRequest<{ Params: { taskId: string } }>, response) => {
	const task = getTaskById(request.params.taskId)
	if (!task) return response.code(404).send({ statusCode: 404, error: "Not found" })

	response.send(task)
})

fastify.delete('/task/:taskId', async (request: FastifyRequest<{ Params: { taskId: string } }>, response) => {
	const taskToDelete = getTaskById(request.params.taskId)
	if (!taskToDelete) return response.code(404).send({ statusCode: 404, error: "Not found" })

	tasks = tasks.filter(task => task.id != taskToDelete.id)
	response.send(taskToDelete)
})

fastify.post('/tasks', {
	schema: {
		body: {
			type: 'object',
			properties: {
				title: { type: 'string' },
				completed: { type: 'string' },
			},
			required: ['title']
		}
	}
}, async (request: FastifyRequest<{ Body: { title: string, completed?: boolean } }>, response) => {
	const task = {
		id: Math.max(...tasks.map(task => task.id)) + 1,
		title: request.body.title,
		completed: !!request.body.completed
	}
	if (!task.title || task.title.length < 1) return response.code(400).send({
		statusCode: 400,
		error: "Bad Request",
		message: "property 'title' must be at least 1 character long"
	})

	tasks.push(task)
	response.send(task)
})

fastify.put('/tasks', {
	schema: {
		body: {
			type: 'object',
			properties: {
				id: { type: 'number' },
				title: { type: 'string' },
				completed: { type: 'string' },
			},
			required: ['id']
		}
	}
}, async (request: FastifyRequest<{ Body: { id: string, title: string, completed?: boolean } }>, response) => {
	const { id, title, completed } = request.body

	const task = getTaskById(id)
	if (!task) return response.code(404).send({ statusCode: 404, error: "Not found" })
	if (title && title.length < 1) return response.code(400).send({
		statusCode: 400,
		error: "Bad Request",
		message: "property 'title' must be at least 1 character long"
	})
	if (title) task.title = title
	if (completed !== undefined) task.completed = completed

	response.send(task)
})

fastify.listen({ port: 3000 }, function (error) {
	if (error) {
		fastify.log.error(error)
		process.exit(1)
	}
})

function getTaskById(taskId: any): Task | undefined {
	taskId = parseInt(new String(taskId).toString())

	if (taskId) return tasks.find((task) => task.id == taskId)
}
