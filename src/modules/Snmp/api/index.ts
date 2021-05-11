import Api from "shared/api/Api";
import {address} from 'shared/api/HttpActions';
import {bind} from 'decko';

class SnpmApi extends Api {
  constructor(public baseUrl: string) {
    super(baseUrl);
  }

  @bind
  public async addOidData(formData: string) {
    const response = await this.actions.post<any>(`/api/table/oid`, formData);
    return response.data;
  }

  @bind
  public async saveOidData(formData: any) { // TODO type
    const id = formData.id;
    delete formData.id;
    const response = await this.actions.put<any>(`/api/table/oid/${id}`, formData);
    return response.data;
  }

  @bind
  public async removeOid(id: string) {
    const response = await this.actions.del<any>(`/api/table/oid/${id}`);
    return response.data;
  }

}

const snpmApi = new SnpmApi(address);
export { snpmApi };
