import { io } from 'socket.io-client';

// Use import.meta.env for Vite
const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const socket = io(URL, {
    autoConnect: false
});