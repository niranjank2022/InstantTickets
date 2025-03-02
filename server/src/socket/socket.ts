import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { selectSeatController, releaseSeatController, confirmSeatController } from "./socket.controller";

let io: Server | null = null;

export function initializeSocket(server: HttpServer) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`New socket client connected: ${socket.id}`);
        socket.on("selectSeat", (data) => selectSeatController(socket, data));
        socket.on("releaseSeat", (data) => releaseSeatController(socket, data));
        socket.on("confirmSeat", (data) => confirmSeatController(socket, data));
        socket.on("disconnect", () => console.log(`Client disconnected: ${socket.id}`));
    });

    return io;
}

export function getIo() {
    if (io == null) {
        throw new Error("Socket.io not initialized!");
    }

    return io;
}
