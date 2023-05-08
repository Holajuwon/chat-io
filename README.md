# Chat-IO

A simple chat application built with Express and Socket.IO.

## Requirements
Before running the application, please ensure that you have the following installed:

- Node.js
- npm

## Installation

Before installing the application, please make sure that you have Node.js and npm installed on your computer.

To install the application, please follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/holajuwon/chat-io.git
```
2. Navigate to the root directory of the application:

```bash
cd chat-io
```
3. Install the dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm start
```
The server will now be running at http://localhost:3000.

## Development
If you want to modify the code, follow these steps:

1. Make sure you have the dependencies installed:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```
This will start the server in development mode, which means that the server will automatically restart whenever you make changes to the code.

## Migrations
This application uses migrations to manage database changes. The migrations are located in the `/migrations` directory.

To create a new migration, run the following command:
```bash
npm run migrate create name-of-migration
```

# Testing

To test the application, follow these steps:

1. Install Docker.
2. Copy the .env.example file and rename it to .env.
3. Populate the .env file with your desired values.
4. Build the Docker container using `npm run docker:build`.
5. Start the Docker container using `npm run docker:start`.

Once the application is running, you can access the following REST endpoints:

- `POST /api/v1/user/register`: Register a new user.
- `POST /api/v1/user/login`: Login a user.

To use the Socket.IO chat functionality, the client should emit the following events:

- `joinRoom`: This will create a chat room for a sender and receiver. The `ReceiverUserId` parameter is required.
- `message`: This will send a message to the chat room. The message `parameter` is required.

On the server side, the following event will be emitted:

- `new-message`: This will be emitted when a new message is received. The `newMessage` parameter will contain the message details.

