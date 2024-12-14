import axios from 'axios';
import { NotificationResponse,NotificationModel} from "../Model/Model";

// const API_URL = 'http://beejobs.io.vn:14307/api/notifications';
const API_URL = 'http://beejobs.io.vn:14307/api';


export const createNotification = async (
  userId: string,
  formUser: string,
  message: string,
  type: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/create`, { userId, formUser, message, type });
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId: string): Promise<NotificationModel[]> => {
  try {
    const response = await axios.get<NotificationModel[]>(`${API_URL}/unread/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

export const getAllNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<NotificationModel[]> => {
  try {
    const response = await axios.get<NotificationResponse>(
      `http://beejobs.io.vn:14307/all/${userId}?page=${page}&limit=${limit}`
    );
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<{ message: string }> => {
  try {
    const response = await axios.put(`http://beejobs.io.vn:14307/markAsRead/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};