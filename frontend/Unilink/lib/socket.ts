import { io } from "socket.io-client";

export const API_URL = "http://YOUR_IP_ADDRESS:3000";

export const socket = io(API_URL, {
  autoConnect: false,
});
