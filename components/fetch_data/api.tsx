import axios, { AxiosResponse } from "axios";
import { Job, Company, CompanyRespone, JobsResponse, User, ApplyJobData } from "../Model/Model";
import AsyncStorage from "@react-native-async-storage/async-storage";

// lấy dữ liệu của user từ asyncstorage
export const getUserData = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem('user_info');
    if (userData) {
      return JSON.parse(userData) as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
// danh sách công việc
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axios.get(
      'http://beejobs.io.vn:14307/api/jobs/getListJobs'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

// rìm công việc theo mức lương
export const findJobBySalary = async (keyword: string): Promise<Job[]> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axios.get(
      `http://beejobs.io.vn:14307/api/jobs/getJobsBySalary`,
      {
        params: {
          keyword,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// tìm công việc theo tên - tiêu đề
export const findJobByTitle = async (keyword: string): Promise<Job[]> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axios.get(
      `http://beejobs.io.vn:14307/api/jobs/getJobsByTitle`,
      {
        params: {
          keyword,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// tìm công việc theo địa điểm
export const findJobByLocation = async (keyword: string): Promise<Job[]> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axios.get(
      `http://beejobs.io.vn:14307/api/jobs/getJobsByLocation`,
      {
        params: {
          keyword,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// tìm công việc theo hình thức
export const findJobByWorkType = async (keyword: string): Promise<Job[]> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axios.get(
      `http://beejobs.io.vn:14307/api/jobs/getJobsByForm`,
      {
        params: {
          keyword,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// tìm công ty theo id
export const findCompanyById = async (keyword: string): Promise<Company | null> => {
  try {
    const response: AxiosResponse<CompanyRespone> = await axios.get(
      `http://beejobs.io.vn:14307/api/companies/getCompanyById/${keyword}`
    );
    const company = response.data.data;
    return company;
  } catch (error) {
    console.log(error);
    return null;
  }
};



// tạo hồ sơ ứng tuyển
export const createApplyProfile = async (data: JSON): Promise<Company> => {
  try {
    const response = await axios.post('http://beejobs.io.vn:14307/api/workers/create/user_id', data);
    return response.data;
  } catch (error) {
    console.error('Error creating worker profile:', error);
    throw error;
  }
};

// get dữ liệu user
// export const getUserData = async () => {
//   try {
//     const userData = await AsyncStorage.getItem('userProfile');
//     if (userData) {
//       setUserData(JSON.parse(userData));
//       decodeToken(JSON.parse(userData).token); 
//     }
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//   }
// };

// api ứng tuyển công việc theo tin bài
export const createApplyJob = async (workerId: string, jobId: string, data: ApplyJobData): Promise<AxiosResponse<any>> => {
  try {
    const formData = new FormData();
    formData.append('cv', data.cv);
    formData.append('status', data.status);

    const response = await axios.post<any>(
      `http://beejobs.io.vn:14307/api/applyJobs/create/${workerId}/${jobId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response;
  } catch (error) {
    console.error('Error creating job application:', error);
    throw error;
  }
};

