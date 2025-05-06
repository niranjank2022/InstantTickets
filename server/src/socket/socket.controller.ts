import { Socket } from 'socket.io';
import { getIo } from './socket';
import { ShowService } from '../services/show.service';
import { SeatStatus, SocketStatus } from '../config/enum';
import { logError, messages } from '../config/logger';

export async function selectSeatController(socket: Socket, data: { showId: string; x: number; y: number }) {
  try {
    const { showId, x, y } = data;
    const show = await ShowService.getShowById(showId);
    if (!show) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.RECORD_NOT_FOUND,
        type: 'select',
        y: y,
        x: x,
      });
    }

    const seat = show.seats.find(seat => seat.x === x && seat.y === y);
    if (!seat) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_NOT_FOUND,
        type: 'select',
        y: y,
        x: x,
      });
    }

    if (seat.status === SeatStatus.Reserved) {
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_ALREADY_RESERVED,
        type: 'select',
        y: y,
        x: x,
      });
    }

    seat.status = SeatStatus.Reserved;
    seat.expirationTime = new Date(Date.now() + 2 * 60 * 1000);
    show.save();
    socket.emit('seatResponse', {
      status: SocketStatus.Success,
      message: messages.SEAT_RESERVED_NOW,
      type: 'select',
      y: y,
      x: x,
    });
    getIo()!.emit('seatUpdate', { ...data, seatStatus: seat.status });
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
    const show = await ShowService.getShowById(showId);
    if (!show) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.RECORD_NOT_FOUND,
        type: 'release',
        y: y,
        x: x,
      });
    }

    const seat = show.seats.find(seat => seat.x === x && seat.y === y);
    if (!seat) {
      console.error(messages.RECORD_NOT_FOUND);
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_NOT_FOUND,
        type: 'release',
        y: y,
        x: x,
      });
    }

    if (seat.status === SeatStatus.Available) {
      return socket.emit('seatResponse', {
        status: SocketStatus.Failure,
        message: messages.SEAT_ALREADY_FREED,
        type: 'release',
        y: y,
        x: x,
      });
    }

    seat.status = SeatStatus.Available;
    seat.expirationTime = null;
    show.save();
    socket.emit('seatResponse', {
      status: SocketStatus.Success,
      message: messages.SEAT_RESERVED_NOW,
      type: 'release',
      y: y,
      x: x,
    });
    console.log(data);
    
    getIo()!.emit('seatUpdate', { ...data, seatStatus: seat.status });
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
