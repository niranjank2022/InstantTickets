import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";
export const socket = io(BASE_URL, {
  autoConnect: false,
  closeOnBeforeunload: false,
});
