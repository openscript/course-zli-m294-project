
export const updateTaskSchema = {
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

export const addTaskSchema = {
	body: {
		type: 'object',
		properties: {
			title: { type: 'string' },
			completed: { type: 'string' },
		},
		required: ['title']
	}
}
