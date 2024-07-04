import { DocumentPickerAsset } from "expo-document-picker";

// file model này chứa các định nghĩa về các object trong dự án
export type JobsResponse = {
  data: Job[];
  message: string;
  createdBy: string;
};

export type Job = {
    _id: string;
    company_id: string;
    title: string;
    desc: string;
    requirements: string;
    salary: string;
    benefits: string;
    location: string;
    created_at: string;
    updated_at: string;
    company_logo: string;
    __v: number;
  };

  export type CompanyRespone = {
    data: Company;
    message: string;
    createdBy: string;
  };

  export type Company =  {
    _id: string;
    user_id: string;
    company_name: string;
    company_address: string;
    company_logo: string;
    company_scale: string;
    company_website: string;
    company_certification: string;
    taxcode: string;
    active: boolean;
    updated_at: string;
    created_at: string;
    __v: number;
  }

  // model của user
  export type User={
    Role: string;
    Username: string;
    id_user: string;
  }

  // model sử dụng cho ứng tuyển
  export interface ApplyJobData {
    cv: DocumentPickerAsset | null;
    status: string;
  }


  