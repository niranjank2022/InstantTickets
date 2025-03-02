import { getIo } from "./socket";
import { Socket } from "socket.io";

import { Show } from "../models/shows";
import { SeatStatus, SocketStatus } from "../config/enums";
import { messages } from "../config/logger";

interface SocketResponse {
    status: SocketStatus;
    message: String;
}

export async function selectSeatController(data: { showId: String, sectionId: String, seatId: String }, callback: (response: SocketResponse) => void) {
    const { showId, sectionId, seatId } = data;
    const show = await Show.findById(showId);
    if (show === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Show not found!"
        });
    }

    const section = show?.sections.find((section) => section._id === sectionId);
    if (section === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Section not found!"
        });
    }

    const seat = section.seats.find((seat) => seat._id === seatId);
    if (seat === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Seat not found!"
        });
    }

    if (seat.status == SeatStatus.Reserved) {
        return callback({
            status: SocketStatus.Failure,
            message: "Seat already reserved!"
        });
    }

    seat.status = SeatStatus.Reserved;
    show?.save();
    callback({
        status: SocketStatus.Success,
        message: "Seat has been reserved!"
    });
    getIo().emit("seatUpdate", { ...data, seatStatus: seat.status });
}

export async function releaseSeatController(data: { showId: String, sectionId: String, seatId: String }, callback: (response: SocketResponse) => void) {
    const { showId, sectionId, seatId } = data;
    const show = await Show.findById(showId);
    if (show === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Show not found!"
        });
    }

    const section = show?.sections.find((section) => section._id === sectionId);
    if (section === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Section not found!"
        });
    }

    const seat = section.seats.find((seat) => seat._id === seatId);
    if (seat === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Seat not found!"
        });
    }

    seat.status = SeatStatus.Available;
    show?.save();
    callback({
        status: SocketStatus.Success,
        message: "Seat has been released!"
    });
    getIo().emit("seatUpdate", { ...data, seatStatus: seat.status });
}

export async function confirmSeatController(data: { showId: String, sectionId: String, seatId: String }, callback: (response: SocketResponse) => void) {
    const { showId, sectionId, seatId } = data;
    const show = await Show.findById(showId);
    if (show === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Show not found!"
        });
    }

    const section = show?.sections.find((section) => section._id === sectionId);
    if (section === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Section not found!"
        });
    }

    const seat = section.seats.find((seat) => seat._id === seatId);
    if (seat === undefined) {
        console.error(messages.RECORD_NOT_FOUND);
        return callback({
            status: SocketStatus.Failure,
            message: "Seat not found!"
        });
    }

    if (seat.status !== SeatStatus.Reserved) {
        return callback({
            status: SocketStatus.Failure,
            message: "Unexpected error has occurred. Can't book this seat!"
        });
    }

    seat.status = SeatStatus.Booked;
    show?.save();
    callback({
        status: SocketStatus.Success,
        message: "Seat has been booked!"
    });
    getIo().emit("seatUpdate", { ...data, seatStatus: seat.status });
}
