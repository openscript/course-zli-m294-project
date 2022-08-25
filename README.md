# Modul 294 LB B Backend
## Version: 2.1.0

### /tasks

#### GET
##### Summary

List all tasks

##### Description

List all tasks

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful operation |

#### PUT
##### Summary

Update an existing task

##### Description

Update an existing task with Id

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful operation |
| 400 | Invalid ID supplied |
| 404 | Task not found |

#### POST
##### Summary

Add a new task

##### Description

Add a new task

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful operation |
| 400 | Invalid input |

### /task/{taskId}

#### GET
##### Summary

Find task by ID

##### Description

Returns a single task

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| taskId | path | ID of task to return | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | successful operation |
| 400 | Invalid ID supplied |
| 403 | Unauthorized |
| 404 | Task not found |

#### DELETE
##### Summary

Deletes a task

##### Description

delete a task

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| taskId | path | Task id to delete | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 400 | Invalid task value |
| 403 | Unauthorized |

### /auth/cookie/tasks

#### GET
##### Summary

List all tasks

##### Description

List all tasks

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful operation |
| 401 | Unauthorized |

#### PUT
##### Summary

Update an existing task

##### Description

Update an existing task by Id

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful operation |
| 400 | Invalid ID supplied |
| 401 | Unauthorized |
| 404 | Task not found |

#### POST
##### Summary

Add a new task

##### Description

Add a new task

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful operation |
| 400 | Invalid input |
| 401 | Unauthorized |

### /auth/cookie/task/{taskId}

#### GET
##### Summary

Find task by ID

##### Description

Returns a single task

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| taskId | path | ID of task to return | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | successful operation |
| 400 | Invalid ID supplied |
| 401 | Unauthorized |
| 404 | Task not found |

#### DELETE
##### Summary

Deletes a task

##### Description

delete a task

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| taskId | path | Task id to delete | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 400 | Invalid task value |
| 401 | Unauthorized |

### /auth/cookie/login

#### GET
##### Summary

Logs user into the system

##### Description

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | query | The user name for login | No | string |
| password | query | The password for login in clear text | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | successful operation |
| 400 | Invalid email/password supplied |

### /auth/cookie/status

#### GET
##### Summary

Returns the email when logged in

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | successful operation |
| 401 | Unauthorized |

### /auth/cookie/logout

#### GET
##### Summary

Logs out current logged in user session

##### Description

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| default | successful operation |

### Models

#### Task

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | integer | _Example:_ `10` | No |
| completed | boolean | _Example:_ `false` | No |
| title | string | _Example:_ `"Feed pets"` | No |
