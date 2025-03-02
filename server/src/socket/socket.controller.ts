import { Socket } from "socket.io";

import { getIo } from "./socket";
import { Show } from "../models/show.model";
import { SeatStatus, SocketStatus } from "../config/enum";
import { messages } from "../config/logger";


export async function selectSeatController(socket: Socket, data: { showId: String, x: Number, y: Number }) {
    try {
        const { showId, x, y } = data;
        const show = await Show.findById(showId);
        if (!show) {
            console.error(messages.RECORD_NOT_FOUND);
            return socket.emit("seatResponse", {
                status: SocketStatus.Failure,
                message: "Show not found!"
            });
        }

        const seat = show?.seats.find((seat) => seat.x === x && seat.y === y);
        if (seat === undefined) {
            console.error(messages.RECORD_NOT_FOUND);
            return socket.emit("seatResponse", {
                status: SocketStatus.Failure,
                message: "Seat not found!"
            });
        }

        if (seat.status == SeatStatus.Reserved) {
            return socket.emit("seatResponse", {
                status: SocketStatus.Failure,
                message: "Seat already reserved!"
            });
        }

        seat.status = SeatStatus.Reserved;
        show?.save();
        socket.emit("seatResponse", {
            status: SocketStatus.Success,
            message: "Seat has been reserved!"
        });
        getIo().emit("seatUpdate", { ...data, seatStatus: seat.status });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error message: ", error.message);
            console.error("Error Stack Trace: ", error.stack);
        } else {
            console.error("Unknown error");
        }
    }
}

export async function releaseSeatController(socket: Socket, data: { showId: String, x: Number, y: Number }) {
    try {
        const { showId, x, y } = data;
        const show = await Show.findById(showId);
        if (!show) {
            console.error(messages.RECORD_NOT_FOUND);
            return socket.emit("seatResponse", {
                status: SocketStatus.Failure,
                message: "Show not found!"
            });
        }

        const seat = show?.seats.find((seat) => seat.x === x && seat.y === y);
        if (seat === undefined) {
            console.error(messages.RECORD_NOT_FOUND);
            return socket.emit("seatResponse", {
                status: SocketStatus.Failure,
                message: "Seat not found!"
            });
        }

        seat.status = SeatStatus.Available;
        show?.save();
        socket.emit("seatResponse", {
            status: SocketStatus.Success,
            message: "Seat has been released!"
        });
        getIo().emit("seatUpdate", { ...data, seatStatus: seat.status });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error message: ", error.message);
            console.error("Error Stack Trace: ", error.stack);
        } else {
            console.error("Unknown error");
        }
    }
}

export async function confirmSeatController(socket: Socket, data: { showId: String, x: Number, y: Number }) {
    try {
        const { showId, x, y } = data;
        const show = await Show.findById(showId);
        if (!show) {
            console.error(messages.RECORD_NOT_FOUND);
            return socket.emit("seatResponse", {
                status: SocketStatus.Failure,
                message: "Show not found!"
            });
        }

        const seat = show?.seats.find((seat) => seat.x === x && seat.y === y);
        if (seat === undefined) {
            console.error(messages.RECORD_NOT_FOUND);
            return socket.emit("seatResponse", {
                status: SocketStatus.Failure,
                message: "Seat not found!"
            });
        }

        if (seat.status !== SeatStatus.Reserved) {
            return socket.emit("seatResponse", {
                status: SocketStatus.Failure,
                message: "Seat already booked. Can't book this seat!"
            });
        }

        seat.status = SeatStatus.Booked;
        show?.save();
        socket.emit("seatResponse", {
            status: SocketStatus.Success,
            message: "Seat has been booked!"
        });
        getIo().emit("seatUpdate", { ...data, seatStatus: seat.status });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error message: ", error.message);
            console.error("Error Stack Trace: ", error.stack);
        } else {
            console.error("Unknown error");
        }
    }
}
