import { io } from "socket.io-client";

export const API_URL = "http://ec2-51-20-64-6.eu-north-1.compute.amazonaws.com:3000";

export const socket = io(API_URL, {
  autoConnect: false,
});