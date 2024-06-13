import axios, {AxiosResponse} from "axios";
import { Job } from "../Model/Model";

type JobsResponse = {
  data: Job[];
  message: string;
  createdBy: string;
};

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

  // test for fetch component
  export const fetchTest = async (): Promise<Job[]> => {
    try {
      const response: AxiosResponse<Job[]> = await axios.get(
        'http://beejobs.io.vn:14307/api/jobs/getListJobs'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  };


  