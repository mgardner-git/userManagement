# WhoCo Takehome

For the instructions and project requirements see the [Instructions](./Instructions.md). 

## Installation

### Requirements

* Docker 18.09+ & Docker Compose
* Node 12.13.0

## Startup

```
# Build / start Django and Postgres containers
docker-compose up

# Start Angular server
cd frontend
npm install
npm start

# Start React server
cd frontend-react
npm install
npm start
```

## URLs

Angular Application: http://localhost:4200/
React Application: http://localhost:3000/

Django admin site: http://localhost:8000/admin
GraphiQL: http://localhost:8000/graphql

## Stack

### Backend (Django)

This project contains a Django backend that exposes a GraphQL endpoint to edit users and the groups they belong to.

There is also a standard Django admin interface that lets you interact directly with the objects in the database.

There is one default superuser account:
- Username: admin
- Password: supersecret

All other pre-installed user accounts (see `initial_data.json`):
- Password: supersecret

If you ever need to reset the database:
```
docker-compose run django /reset_data
```

### GraphQL

GraphiQL is enabled to use to manually inspect the schema and execute queries and mutations against the backend. The following types exist (but use in GraphiQL to inspect the schema for the most up-to-date information):

```
User {
    id: int
    username: string (required)
    first_name: string
    last_name: string
    email: string
}

Group {
    id: int
    name: string
    users: List[User]
}

// Used only when creating or updating a user
UserInput {
    username: string (required)
    password: string (requirement depends on mutation)
    first_name: string
    last_name: string
    email: string
}
```

For users, the following queries and mutations are available:

```
Users() -> List[User]

User(id: int) -> User

// Requires the presence of the `password` field in the data parameter.
CreateUser(data: UserInput) -> User 

// The `password` field of the UpdateUser mutation is optional.
// If present, it will update the specified user's password.
UpdateUser(id: int, data: UserInput) -> User

DeleteUser(id: int) -> Void 
```

For groups, the following queries and mutations are available:

```
Groups() -> List[Group]

Group(id) -> Group

CreateGroup(data: GroupInput) -> Group

UpdateGroup(id: int, data: GroupInput) -> Group

RemoveGroup(id: int) -> Void

AddUserToGroup(groupId: int, userId: int) -> Group

RemoveUserFromGroup(groupId: int, userId: int) -> Group
```
