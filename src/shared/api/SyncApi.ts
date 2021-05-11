import HttpActions from './HttpActions';

import {bind} from 'decko';
import {getResourceUrl} from 'shared/helpers/resourceConvertion';
import {ISyncData} from 'shared/types/app';

class SyncApi {

  private actions: HttpActions;

  constructor(public baseUrl: string) {
    this.actions = new HttpActions(baseUrl);
  }

  @bind
  public async loadSyncData(resource: string): Promise<any> {
    const requestUrl = getResourceUrl(resource);
    const response = await this.actions.get<{}>(`/api/table/${requestUrl}`);
    return response.data;
  }

  @bind
  public async trySyncItems(data: ISyncData, resource: string): Promise<any> {
    const response = await this.actions.put<ISyncData>(`api/table/${resource}/sync`, data);
    return response.data;
  }

  @bind
  public async tryAsyncItems(data: ISyncData, resource: string): Promise<any> {
    const response = await this.actions.put<ISyncData>(`api/table/${resource}/unsync`, data);
    return response.data;
  }

  @bind
  public async syncItems(data: ISyncData, resource: string): Promise<any> {
    const response = await this.actions.post<ISyncData>(`api/table/${resource}/sync`, data);
    return response.data;
  }

  @bind
  public async unsyncItems(data: ISyncData, resource: string): Promise<any> {
    const response = await this.actions.post<ISyncData>(`api/table/${resource}/unsync`, data);
    return response.data;
  }
}

export default SyncApi;
