import { DocumentPickerAsset, DocumentPickerResult } from "expo-document-picker";
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

// file model này chứa các định nghĩa về các object trong dự án
export type JobsResponse = {
  data: Job[];
  message: string;
  createdBy: string;
};

export type JobsResponseSingle = {
  data: Job;
  message: string;
  createdBy: string;
};

export type Job = {
  _id: string;
  company_id: string;
  title: string;
  desc: string;
  requirements: string;
  experience: string;
  salary: string;
  benefits: string;
  location: string;
  created_at: string;
  updated_at: string;
  company_logo: string;
  company_name: string;
  major: string;
  form: string;
  number_of_recruitments: string;
  deadline: string;
  working_time: string;
  __v: number;
};

export type CompanyRespone = {
  data: Company;
  message: string;
  createdBy: string;
};

export type Company = {
  _id: string;
  user_id: string;
  company_name: string;
  company_address: string;
  company_desc: string;
  company_logo: string;
  company_scale: string;
  company_website: string;
  company_certification: string;
  taxcode: string;
  status: string;
  updated_at: string;
  created_at: string;
  __v: number;
}

// model của user
export interface User {
  Role: string;
  Username: string;
  id_user: string;
}

// model sử dụng cho ứng tuyển
export interface ApplyJobData {
  cv: {
    uri: string;
    name: string;
    type: string;
  };
  fullname: string;
  phone_number: string;
  email: string;
  intro_letter: string;
}

// việc đã ứng tuyển
export interface AppliedJobsResponse {
  data: AppliedJob[];
  message: string;
  createdBy: string;
}
export interface AppliedJob {
  [x: string]: any;
  _id: string;
  job_id: Job;
  worker_id: Worker;
  cv: string;
  status: string;
  // fullname: string;
  phone_number: string;
  intro_letter: string;
  applied_at: Date;
  // company_name: string;
  company: Company;
  __v: number;
  // job: Job
}

// check applied
export interface CheckApplyJobResponse {
  isApplied: boolean;
  message: string;
}

//check folowing
export interface CheckFolow {
  isFollowing: boolean;
}

// worker
export type Worker = {
  _id: string;
  user_id: string;
  worker_name: string;
  worker_avatar: string;
  phone: string;
  email: string;
  major: string;
  experience: string;
  address: string;
  // __v: number;
}

export type WokerRespone = {
  worker_info: Worker;
  message: string;
  createdBy: string;
}

// chat
export interface Message {
  _id: string;           // ID của tin nhắn
  content: string;       // Nội dung tin nhắn
  senderId: string;      // ID của người gửi
  createdAt: string;     // Thời gian tạo tin nhắn (dạng ISO 8601)
  chatRoomId: string;    // ID của phòng chat
}

export interface ChatRoomModel {
  _id: string;                // ID của phòng chat
  userIds: string[];          // Danh sách ID của người dùng tham gia phòng chat
}

//
export type AppliedJobRespone = {
  appliedjobsLastWeek: AppliedJob[];
  appliedjobsLast30Days: AppliedJob[];
  allAppliedjobs: AppliedJob[];
}


//==============Notice =================
export interface NotificationModel {
  _id: string;
  userId: string;
  formUser: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
}

export interface NotificationPushModel {
  title: string;
  message: string;
}