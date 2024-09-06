import { GetJobReq } from '../models/jobs.model';
import ApiService from './api.service';

export default class JobsService extends ApiService {
  public getJobs(params: GetJobReq): Promise<any> {
    return this.apiGet(`/jobs/searching`, params);
  }
}
