import { Socket } from 'socket.io';

import { getIo } from './socket';
import { Show } from '../models/show.model';
import { SeatStatus, SocketStatus } from '../config/enum';
import { logError, messages } from '../config/logger';

export async function selectSeatController(socket: Socket, data: { showId: string; x: number; y: number }) {
  try {
    const { showId, x, y } = data;
    const show = await Show.findById(showId);
    if (!show) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.RECORD_NOT_FOUND,
      });
    }

    const seat = show.seats.find(seat => seat.x === x && seat.y === y);
    if (seat === undefined) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_NOT_FOUND,
      });
    }

    if (seat.status === SeatStatus.Reserved) {
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_ALREADY_RESERVED,
      });
    }

    seat.status = SeatStatus.Reserved;
    show.save();
    socket.emit('seatResponse', {
      status: SocketStatus.Success,
      message: messages.SEAT_RESERVED_NOW,
    });
    getIo().emit('seatUpdate', { ...data, seatStatus: seat.status });
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}

export async function releaseSeatController(socket: Socket, data: { showId: string; x: number; y: number }) {
  try {
    const { showId, x, y } = data;
    const show = await Show.findById(showId);
    if (!show) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.RECORD_NOT_FOUND,
      });
    }

    const seat = show.seats.find(seat => seat.x === x && seat.y === y);
    if (seat === undefined) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_NOT_FOUND,
      });
    }

    seat.status = SeatStatus.Available;
    show.save();
    socket.emit('seatResponse', {
      status: SocketStatus.Success,
      message: messages.SEAT_RESERVED_NOW,
    });
    getIo().emit('seatUpdate', { ...data, seatStatus: seat.status });
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}

export async function confirmSeatController(socket: Socket, data: { showId: string; x: number; y: number }) {
  try {
    const { showId, x, y } = data;
    const show = await Show.findById(showId);
    if (!show) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.RECORD_NOT_FOUND,
      });
    }

    const seat = show.seats.find(seat => seat.x === x && seat.y === y);
    if (seat === undefined) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_NOT_FOUND,
      });
    }

    if (seat.status !== SeatStatus.Reserved) {
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_CANNOT_BOOK,
      });
    }

    seat.status = SeatStatus.Booked;
    show.save();
    socket.emit('seatResponse', {
      status: SocketStatus.Success,
      message: messages.SEAT_BOOKED_NOW,
    });
    getIo().emit('seatUpdate', { ...data, seatStatus: seat.status });
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
