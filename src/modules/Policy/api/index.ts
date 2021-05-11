import Api from "shared/api/Api";
import {address} from 'shared/api/HttpActions';
import {bind} from 'decko';

class PolicyApi extends Api {
  constructor(public baseUrl: string) {
    super(baseUrl);
  }

  @bind
  public async editMarkPolicy(newData: any, id: number) {
    const response = await this.actions.put<any>(`/api/table/label_policies/${id}`, newData);
    return response.data;
  }

  @bind
  public async createMarkPolicy(newData: any) {
    const response = await this.actions.post<any>(`/api/table/label_policies`, newData);
    return response.data;
  }

  @bind
  public async fetchTextData() {
    const response = await this.actions.get<any>(`/api/short/text_labels`);
    return response.data;
  }

  @bind
  public async editTextLabel(id: number, newData: any) {
    const response = await this.actions.put<any>(`/api/table/text_labels/${id}`, newData);
    return response.data;
  }

  @bind
  public async uploadFile(file: any) {
    const response = await this.actions.post<any>(`/api/files`, file);
    return response.data;
  }

  @bind
  public async getFile(id: any) {
    const response = await this.actions.get<any>(`/api/files/${id}`);
    return response.data;
  }

  @bind
  public async loadHostGroups() {
    const response = await this.actions.get<any>(`/api/short/host_groups`);
    return response.data;
  }

  @bind
  public async saveAgentPolicy(id: number, newData: any) {
    const response = await this.actions.put<any>(`/api/table/agent_policies/${id}`, newData);
    return response.data;
  }

  @bind
  public async createAgentPolicy(newData: any) {
    const response = await this.actions.post<any>(`/api/table/agent_policies`, newData);
    return response.data;
  }

  @bind
  public async switchAgentPolicyValue(id: any, state: boolean) {
    const response = await this.actions.put<any>(`/api/table/agent_policies/${id}`, { value: state });
    return response.data;
  }

  @bind
  public async createCopyPolicy(data: any) {
    const response = await this.actions.post<any>(`/api/table/backup_policy`, data);
    return response.data;
  }

  @bind
  public async saveCopyPolicy(id: any, data: any) {
    const response = await this.actions.put<any>(`/api/table/backup_policy/${id}`, data);
    return response.data;
  }

  @bind
  public async createEconomyPolicy(data: any) {
    const response = await this.actions.post<any>(`/api/table/all_policies`, data);
    return response.data;
  }

  @bind
  public async saveEconomyPolicy(id: any, data: any) {
    const response = await this.actions.put<any>(`/api/table/all_policies/${id}`, data);
    return response.data;
  }

  @bind
  public async decrypt(hash: string) {
    const response = await this.actions.get<any>(`/api/hash?hash=${hash}`);
    return response.data;
  }

}

const policyApi = new PolicyApi(address);
export { policyApi };
