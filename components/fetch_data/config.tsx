import { io } from 'socket.io-client';

const baseUrl = 'http://beejobs.io.vn:14307';

const socket = io(baseUrl); // Khởi tạo kết nối Socket.IO

export default socket;
