import Fastify, { FastifyRequest } from 'fastify'
import { readFileSync } from 'fs';
import { getTaskById, getAllTasks, deleteTaskById, addTask, updateTask } from './task_service';

const fastify = Fastify({
	logger: true
})

fastify.get('/', async (request, response) => {
	response.type('text/html').send(readFileSync('index.html'))
})

fastify.get('/tasks', async (request, response) => {
	response.send(getAllTasks())
})

fastify.get('/task/:taskId', async (request: FastifyRequest<{ Params: { taskId: string } }>, response) => {
	const task = getTaskById(parseId(request.params.taskId))
	if (!task) return response.code(404).send({ statusCode: 404, error: "Not found" })

	response.send(task)
})

fastify.delete('/task/:taskId', async (request: FastifyRequest<{ Params: { taskId: string } }>, response) => {
	const taskToDelete = getTaskById(parseId(request.params.taskId))
	if (!taskToDelete) return response.code(404).send({ statusCode: 404, error: "Not found" })

	deleteTaskById(taskToDelete.id)
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
	try {
		const task = addTask({ title: request.body.title, completed: request.body.completed })
		response.send(task)
	} catch (e) {
		return response.code(400).send({
			statusCode: 400,
			error: "Bad Request",
			message: e instanceof Error ? e.message : undefined
		})
	}
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

	try {
		const task = updateTask({ id: parseId(id), title, completed })
		if (task) return response.send(task)

		return response.code(404).send({ statusCode: 404, error: "Not found" })
	} catch (e) {
		return response.code(400).send({
			statusCode: 400,
			error: "Bad Request",
			message: e instanceof Error ? e.message : undefined
		})
	}
})

fastify.listen({ port: 3000 }, function (error) {
	if (error) {
		fastify.log.error(error)
		process.exit(1)
	}
})

function parseId(id: any): number | undefined {
	return parseInt(new String(id).toString())
}
