import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http';
import { error, parseId } from '../helpers';
import { addTaskSchema, loginSchema, updateTaskSchema } from '../schemas';
import * as taskService from '../task_service';

declare module "fastify" {
	interface Session {
		email?: string
	}
}

export async function authenticate(request: FastifyRequest, response: FastifyReply) {
	if (!request.session.email) return response.code(401).send(error(401, 'authenicate your session via /auth/cookie/login'))
}

export default function setup(fastify: FastifyInstance) {

	fastify.register(fastifyCookie);
	fastify.register(fastifySession, {
		cookieName: 'm294-session',
		secret: 'this is just an example, not a real secret',
		cookie: { secure: false, httpOnly: true },
	})

	fastify.route(listTasks)
	fastify.route(showTask)
	fastify.route(deleteTask)
	fastify.route(updateTask)
	fastify.route(createTask)

	fastify.get('/auth/cookie/status', { onRequest: authenticate }, async (request, response) => {
		response.send({ email: request.session.email })
	})

	fastify.post('/auth/cookie/login', { schema: loginSchema }, async (request: FastifyRequest<{ Body: { email: string, password: string } }>, response) => {
		const { email, password } = request.body

		if (password === 'm294') {
			request.session.email = email
			return response.send('ok')
		} else {
			return response.code(400).send({ statusCode: 400, message: 'invalid credentials, use «m294» as password', })
		}
	})

	fastify.post('/auth/cookie/logout', (request, reply) => {
		request.session.destroy()
		reply.send('ok')
	})
}

const listTasks: RouteOptions<Server, IncomingMessage, ServerResponse, {}> = {
	method: "GET",
	url: '/auth/cookie/tasks',
	onRequest: authenticate,
	handler: async (request, response) => {
		response.send(taskService.getAllTasks())
	}
}

const showTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Params: { taskId: string } }> = {
	method: "GET",
	url: '/auth/cookie/task/:taskId',
	onRequest: authenticate,
	handler: async (request, response) => {
		const task = taskService.getTaskById(parseId(request.params.taskId))
		if (!task) return response.code(404).send({ statusCode: 404, error: "Not found" })

		response.send(task)
	}
}

const deleteTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Params: { taskId: string } }> = {
	method: "DELETE",
	url: '/auth/cookie/task/:taskId',
	onRequest: authenticate,
	handler: async (request, response) => {
		const taskToDelete = taskService.getTaskById(parseId(request.params.taskId))
		if (!taskToDelete) return response.code(404).send({ statusCode: 404, error: "Not found" })

		taskService.deleteTaskById(taskToDelete.id)
		response.send(taskToDelete)
	}
}

const createTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Body: { title: string, completed?: boolean } }> = {
	method: "POST",
	url: '/auth/cookie/tasks',
	schema: addTaskSchema,
	onRequest: authenticate,
	handler: async (request, response) => {
		try {
			const task = taskService.addTask({ title: request.body.title, completed: request.body.completed })
			response.send(task)
		} catch (e) {
			return response.code(400).send(error(400, (e as Error).message))
		}
	}
}

const updateTask: RouteOptions<Server, IncomingMessage, ServerResponse, {
	Body: {
		id: string, title: string, completed?: boolean
	}
}> = {
	method: "PUT",
	url: '/auth/cookie/tasks',
	schema: updateTaskSchema,
	onRequest: authenticate,
	handler: async (request, response) => {
		const { id, title, completed } = request.body

		try {
			const task = taskService.updateTask({ id: parseId(id), title, completed })
			if (task) return response.send(task)

			return response.code(404).send({ statusCode: 404, error: "Not found" })
		} catch (e) {
			return response.code(400).send(error(400, (e as Error).message))
		}
	}
}
