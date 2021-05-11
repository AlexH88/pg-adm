import Api from "shared/api/Api";
import {address} from 'shared/api/HttpActions';
import {bind} from 'decko';

class PrintersApi extends Api {
  constructor(public baseUrl: string) {
    super(baseUrl);
  }

  @bind
  public async updateHostGroup(groupId: number, newData: any) {
    const response = await this.actions.put<any>(`/api/table/hostgroups/${groupId}`, newData);
    return response.data;
  }

  @bind
  public async forseRestart(groupId: number) {
    const response = await this.actions.post<any>(`/api/table/hostgroups/force_stop/${groupId}`);
    return response.data;
  }

  @bind
  public async runUpdate() {
    const response = await this.actions.get<any>(`/api/upd/doUpdate`);
    return response.data;
  }

  @bind
  public async forceActivate(groupId: number, isActivate: boolean) {
    const response = await this.actions.post<any>(`/api/table/hostgroups/activate/${groupId}?active=${isActivate}`);
    return response.data;
  }

  @bind
  public async forceLog(printerId: number) {
    const response = await this.actions.post<any>(`api/table/hosts/force_log/${printerId}`);
    return response.data;
  }


}

const printersApi = new PrintersApi(address);
export { printersApi };
