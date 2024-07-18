import axios, { AxiosResponse } from "axios";
import { Job, Company, Worker, CompanyRespone, JobsResponse, User, ApplyJobData, AppliedJob, JobsResponseSingle, AppliedJobsResponse, CheckApplyJobResponse, WokerRespone } from "../Model/Model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DocumentPickerAsset } from "expo-document-picker";
import FormData from 'form-data'
// import { DocumentPickerAsset } from "expo-document-picker";
// import File from "react-native";

// lấy dữ liệu của user từ asyncstorage
export const getUserInfo = async (): Promise<User | null> => {
  try {
    const userInfo = await AsyncStorage.getItem('user_info');
    if (userInfo) {
      const user: User = JSON.parse(userInfo);
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
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

// lấy danh sách công việc theo id company
export const fetchJobsByCompanyId = async (keywword: string): Promise<Job[]> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axios.get(
      `http://beejobs.io.vn:14307/api/jobs/getJobsByIdCompany/${keywword}`
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

// api ứng tuyển công việc theo tin bài
export const createApplyJob = async (worker_id: string, job_id: string, data: ApplyJobData) => {
  try {
    const formData = new FormData();
    formData.append('cv', {
      uri: data.cv.uri,
      name: data.cv.name,
      type: data.cv.type,
    } as any);
    // formData.append('phone', phone);
    // formData.append('name', workerName)

    const response = await axios.post(
      `http://beejobs.io.vn:14307/api/applyJobs/create/${worker_id}/${job_id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('Error of aoxis:', error.response.data);
      throw new Error(`Error fetching applied jobs: ${error.response.data.message}`);
    } else {
      console.log('Error fetching applied jobs:', error);
      throw new Error('An unexpected error occurred while fetching applied jobs.');
    }
  }
};

// danh sách việc làm đã ứng tuyển
// tìm công việc theo hình thức
// export const getAppliedJobsByWorker = async (worker_id: string): Promise<AppliedJob[]> => {
//   try {
//     const response: AxiosResponse<AppliedJobsResponse> = await axios.get(
//       `http://beejobs.io.vn:14307/api/applyJobs/getApylyJobsByIdWorker/${worker_id}`
//     );

//     // Lấy danh sách các công việc đã ứng tuyển
//     const appliedJobs = response.data.data;

//     // Lấy thông tin job cho từng đơn ứng tuyển
//     const updatedAppliedJobs = await Promise.all(
//       appliedJobs.map(async (job) => {
//         const JobResponse: AxiosResponse<JobsResponseSingle> = await axios.get(
//           `http://beejobs.io.vn:14307/api/jobs/getJobById/${job.job_id}`
//         );
//         return {
//           ...job,
//           job: JobResponse.data.data,
//         };
//       })
//     );

//     return updatedAppliedJobs;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       console.log('Error fetching applied jobs:', error.response.data);
//       throw new Error(`Error fetching applied jobs: ${error.response.data.message}`);
//     } else {
//       console.log('Error fetching applied jobs:', error);
//       throw new Error('An unexpected error occurred while fetching applied jobs.');
//     }
//   }
// };

export const getAppliedJobsByWorker = async (worker_id: string): Promise<AppliedJob[]> => {
  try {
    const response: AxiosResponse<AppliedJobsResponse> = await axios.get(
      `http://beejobs.io.vn:14307/api/applyJobs/getApylyJobsByIdWorker/${worker_id}`
    );

    // Lấy danh sách các công việc đã ứng tuyển
    const appliedJobs = response.data.data;

    // Lấy thông tin job và công ty cho từng đơn ứng tuyển
    const updatedAppliedJobs = await Promise.all(
      appliedJobs.map(async (job) => {
        const jobResponse: AxiosResponse<JobsResponseSingle> = await axios.get(
          `http://beejobs.io.vn:14307/api/jobs/getJobById/${job.job_id}`
        );
        const jobData = jobResponse.data.data;

        const companyResponse: AxiosResponse<CompanyRespone> = await axios.get(
          `http://beejobs.io.vn:14307/api/companies/getCompanyById/${jobData.company_id}`
        );
        // const response: AxiosResponse<CompanyRespone> = await axios.get(
        //   `http://beejobs.io.vn:14307/api/companies/getCompanyById/${keyword}`
        // );
        // const company = response.data.data;

        return {
          ...job,
          job: {
            ...jobData,
            company_name: companyResponse.data.data.company_name,
          },
        };
      })
    );

    return updatedAppliedJobs;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('Error fetching applied jobs:', error.response.data);
      throw new Error(`Error fetching applied jobs: ${error.response.data.message}`);
    } else {
      console.log('Error fetching applied jobs:', error);
      throw new Error('An unexpected error occurred while fetching applied jobs.');
    }
  }
};


export const checkApplyJob = async (worker_id: string, job_id: string): Promise<CheckApplyJobResponse> => {
  try {
    const response: AxiosResponse<CheckApplyJobResponse> = await axios.get(
      `http://beejobs.io.vn:14307/api/applyJobs/checkApplyJobs/${worker_id}/${job_id}`
    );
    // console.log(JSON.stringify(response.data.message))
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error in checking apply job status:', error.response.data);
      throw new Error(`Error checking apply job status: ${error.response.data.message}`);
    } else {
      console.error('Unexpected error in checking apply job status:', error);
      throw new Error('An unexpected error occurred while checking apply job status.');
    }
  }
};

export const findWorkerById = async (keyword: string): Promise<Worker | null> => {
  try {
    const response: AxiosResponse<WokerRespone> = await axios.get(
      `http://beejobs.io.vn:14307/api/workers/getInforWorker/${keyword}`
    );
    // console.log(response.status)
    const worker = response.data.worker_info;
    return worker;
  } catch (error) {
    console.log(error);
    return null;
  }
};
