import Fastify from 'fastify'
import { readFileSync } from 'fs';
import setupPlainEndpoint from './endpoints/plain';
import setupCookieEndpoint from './endpoints/cookie';

const fastify = Fastify({
	logger: true
})

setupPlainEndpoint(fastify)
setupCookieEndpoint(fastify)

fastify.get('/', async (request, response) => {
	response.type('text/html').send(readFileSync('index.html'))
})

fastify.listen({ port: 3000 }, function (error) {
	if (error) {
		fastify.log.error(error)
		process.exit(1)
	}
})

