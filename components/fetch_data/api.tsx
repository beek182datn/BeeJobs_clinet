import axios, { AxiosResponse } from "axios";
import { Job, Company, CompanyRespone, JobsResponse } from "../Model/Model";

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

// http://beejobs.io.vn:14307/api/companies/getCompanyById/:company_id

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

