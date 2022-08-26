import { FastifyInstance, FastifyRequest } from 'fastify'
import { error, parseId } from '../helpers';
import { addTaskSchema, updateTaskSchema } from '../schemas';
import { getTaskById, getAllTasks, deleteTaskById, addTask, updateTask } from '../task_service';


export default function setup(fastify: FastifyInstance) {

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

	fastify.post('/tasks', { schema: addTaskSchema }, async (request: FastifyRequest<{ Body: { title: string, completed?: boolean } }>, response) => {
		try {
			const task = addTask({ title: request.body.title, completed: request.body.completed })
			response.send(task)
		} catch (e) {
			return response.code(400).send(error(400, (e as Error).message))
		}
	})

	fastify.put('/tasks', { schema: updateTaskSchema }, async (request: FastifyRequest<{ Body: { id: string, title: string, completed?: boolean } }>, response) => {
		const { id, title, completed } = request.body

		try {
			const task = updateTask({ id: parseId(id), title, completed })
			if (task) return response.send(task)

			return response.code(404).send({ statusCode: 404, error: "Not found" })
		} catch (e) {
			return response.code(400).send(error(400, (e as Error).message))
		}
	})
}
