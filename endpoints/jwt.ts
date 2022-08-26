import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http';
import { error, parseId } from '../helpers';
import { addTaskSchema, loginSchema, updateTaskSchema } from '../schemas';
import * as taskService from '../task_service';

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: { email: string }
		user: {
			email: string
		}
	}
}

export async function authenticate(request: FastifyRequest, response: FastifyReply) {
	try {
		await request.jwtVerify()
	} catch (err) {
		response.code(401).send(error(401, 'authenicate with valid jwt token /auth/jwt/sign'))
	}
}

export default function setup(fastify: FastifyInstance) {

	fastify.register(fastifyJwt, {
		secret: 'this is just an example, not a real secret',
	})

	fastify.route(listTasks)
	fastify.route(showTask)
	fastify.route(deleteTask)
	fastify.route(updateTask)
	fastify.route(createTask)

	fastify.get('/auth/jwt/verify', { onRequest: authenticate }, async (request, response) => {
		request.jwtVerify(function (err, decoded) {
			return response.send(err || decoded)
		})
	})

	fastify.post('/auth/jwt/sign', { schema: loginSchema }, async (request: FastifyRequest<{ Body: { email: string, password: string } }>, response) => {
		const { email, password } = request.body

		if (password === 'm294') {
			request.session.email = email
			response.jwtSign({ email }, function (err, token) {
				return response.send(err || { 'token': token })
			})
		} else {
			return response.code(400).send({ statusCode: 400, message: 'invalid credentials, use «m294» as password', })
		}
	})
}

const listTasks: RouteOptions<Server, IncomingMessage, ServerResponse, {}> = {
	method: "GET",
	url: '/auth/jwt/tasks',
	onRequest: authenticate,
	handler: async (request, response) => {
		response.send(taskService.getAllTasks())
	}
}

const showTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Params: { taskId: string } }> = {
	method: "GET",
	url: '/auth/jwt/task/:taskId',
	onRequest: authenticate,
	handler: async (request, response) => {
		const task = taskService.getTaskById(parseId(request.params.taskId))
		if (!task) return response.code(404).send({ statusCode: 404, error: "Not found" })

		response.send(task)
	}
}

const deleteTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Params: { taskId: string } }> = {
	method: "DELETE",
	url: '/auth/jwt/task/:taskId',
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
	url: '/auth/jwt/tasks',
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
	url: '/auth/jwt/tasks',
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
