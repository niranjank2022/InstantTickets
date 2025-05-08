# Instant Tickets - Backend
Welcome to Instant Tickets! The perfect point to experience cinema at any part of the world!


## Table of Contents
1. [About](#about)
3. [Running the application](#running-the-application)
4. [Project Structure](#project-structure)
5. [Features](#features)

## About
This is the backend codebase for the application Instant-Tickets using RESTful APIs and sockets. The tools used are Express, Node, MongoDb, Socket.io, Postman and Jest.

## Running the application
Create a .env file and mention the following key-values.
```
PORT=<port no you want you application to run in your local machine>
MONGODB_URI="<The connection URI to your database cluster in MongoDB Atlas>"
```

Note that, **npm** and **node** must be installed in your system proper functioning of application.
```bash
npm install
npm run build           # To compile src/ to dist/
npm start               # To run the compiled dist/index.js
```

## Project Structure
```
/
|
|--- src
|    |
|    |--- config
|    |    |
|    |    |--- config.ts
|    |    |--- enum.ts
|    |    |--- logger.ts
     |
|    |--- controllers
|    |    |
|    |    |--- booking.controller.ts
|    |    |--- show.controller.ts
|    |    |--- venue.controller.ts
|    |
|    |--- models     # Contains the schema of the MongoDB collections
|    |    |
|    |    |--- booking.model.ts
|    |    |--- show.model.ts
|    |    |--- venue.model.ts
|    |    
|    |--- routes     # Contains the route handler functions
|    |    |
|    |    |--- booking.route.ts
|    |    |--- show.route.ts
|    |    |--- venue.route.ts
|    |
|    |--- seed     # Contains the seeding functions
|    |    |
|    |    |--- booking.seed.ts
|    |    |--- show.seed.ts
|    |    |--- venue.seed.ts
|    |    |--- index.ts
|    |
|    |--- socket     # Contains the seeding functions
|    |    |
|    |    |--- socket.controller.ts
|    |    |--- socket.ts
|    |
|    |--- app.ts                 # Express app
|    |--- index.ts               # The application program
|
|--- tests
|    |
|    |--- integration
|    |    |
|    |    |--- api
|    |    |    |
|    |    |    |--- booking.test.ts
|    |    |    |--- misc.test.ts
|    |    |    |--- show.test.ts
|    |    |    |--- venue.test.ts
|    |    |
|    |    |--- database
|    |    |
|    |    |--- socket
|    |         |
|    |         |--- confirmSeat.test.ts
|    |         |--- releaseSeat.test.ts
|    |         |--- selectSeat.test.ts
|    |
|    |--- unit
|         |
|         |--- getIo.test.ts
|         |--- log.test.ts
|
|--- .env
|--- .gitignore
|--- .nvmrc
|--- .prettierrc
|--- eslint.config.mjs
|--- jest.config.js
|--- package-lock.json
|--- package.json           # npm packages required 
|--- README.md
|--- tsconfig.json
```

## Features

- Users can select a seat, cancel the selection and finally confirm.
- This feature takes care of real-time updation as well.

## Conclusion

That's it for now. Check again later for more texts and formatting.