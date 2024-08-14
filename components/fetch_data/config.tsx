import { io } from 'socket.io-client';
import { NotificationPushModel } from '../Model/Model';

const baseUrl = 'http://beejobs.io.vn:14307';
const socket = io(baseUrl);

// Hàm lắng nghe tin nhắn mới
export const listenForNewMessages = (callback: (message: any) => void) => {
    socket.on('message', (message: any) => {
        console.log('Received new message:', message);
        callback(message); // Gọi callback với tin nhắn mới
    });
};
export const listenForNotifications = (callback: (notificationPushModel: NotificationPushModel) => void) => {
    socket.on('newNotification', (notificationPushModel: NotificationPushModel) => {
      console.log('Received new notification:', notificationPushModel);
      callback(notificationPushModel);
    });
  };


// export const disconnectSocket = () => {
//     socket.disconnect();
// };

export default socket;
