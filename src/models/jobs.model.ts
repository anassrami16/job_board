export interface GetJobReq {
  board_keys: string[];
  page?: string;
  limit?: string;
  order_by?: string;
}

export interface Job {
  id: number;
  name: string;
  created_at: string;
  location?: {
    fields?: any[];
    gmaps?: any;
    lat?: any;
    lng?: any;
    text?: string;
  };
  company: string;
  category?: string;
  skills?: {
    name: string;
    type?: string;
    value?: any;
  }[];
  summary?: string;
  tags?: {
    name: string;
    value?: string;
  }[];
  certifications?: {
    name: string;
    type?: any;
    value?: any;
  }[];
  tasks?: {
    name: string;
    type?: any;
    value?: any;
  }[];
}

export interface GetJobsApiResp {
  code: number;
  message: string;
  data?: {
    jobs: Job[];
  };
  meta?: {
    count: number;
    maxPage: number;
    page: number;
    text_keywords_synonyms?: any[];
    total: number;
  };
}
