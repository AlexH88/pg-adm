import Api from 'shared/api/Api';
import {address} from 'shared/api/HttpActions';
import {bind} from 'decko';

class StatusApi extends Api {
  constructor(public baseUrl: string) {
    super(baseUrl);
  }

  @bind
  public async getTopUsers(settingsChart: any) {
    const response = await this.actions.get<any>(`/api/table/status/users?startDate=${settingsChart.startDate}&endDate=${settingsChart.endDate}`);
    const data = {users: response.data}
    return data;
  }

  @bind
  public async getTopGroupsUsers(settingsChart : any) {
    const response = await this.actions.get<any>(`/api/table/status/userGroups?startDate=${settingsChart.startDate}&endDate=${settingsChart.endDate}`);
    const data = {groupsUsers: response.data}
    return data;
  }

  @bind
  public async getTopPrintedGroups(settingsChart: any) {
    const response = await this.actions.get<any>(`/api/table/status/printerGroups?startDate=${settingsChart.startDate}&endDate=${settingsChart.endDate}`);
    const data = {groups: response.data}
    return data;
  }

  @bind
  public async getTopUsersFromGroup(groupId: number) {
    const response = await this.actions.get<any>(`/api/status/users?group_id=${groupId}`);
    return response.data;
  }

  @bind
  public async getTopPrinters(settingsChart: any) {
    const response = await this.actions.get<any>(`/api/table/status/printers?startDate=${settingsChart.startDate}&endDate=${settingsChart.endDate}`);
    const data = {printers: response.data}
    return data;
  }

  @bind
  public async getPrintedPages(settingsChart: any) {
    const response = await this.actions.get<any>(`/api/table/status/statusPeriod?startDate=${settingsChart.startDate}&endDate=${settingsChart.endDate}&period=${settingsChart.period}`);

    const arrDateTime = response.data.map((item) => {
      let d = new Date(item.date).toISOString()
      return {
        pages: item.pages,
        time: Date.parse(d.slice(0,10))/1000
      }
    })
    const data = {data: arrDateTime}
    return data;
  }

  @bind
  public async getPrintedGroupsPages(settingsChart: any) {
    const response = await this.actions.get<any>(`/api/table/status/groupPeriod?startDate=${settingsChart.startDate}&endDate=${settingsChart.endDate}&period=${settingsChart.period}`);

    const arrDateTime = response.data.map((item) => {
//      let d = new Date(item.date).toISOString()
      let resStrDate = item.date.substr(0,8) + '0' + item.date.substr(8,2);
      return {
//        pages: item.pages,
//        time: Date.parse(d.slice(0,10))/1000,
//        time: new Date(item.date),
        time: resStrDate,
        pages: item.pages,
        name: item.name
      }
    })
    const data = {data: arrDateTime}
    return data;
  }

  @bind
  public async getDynamicGrow(interval: string) {
    const response = await this.actions.get<any>(`/api/status/groups_dynamic?interval=${interval}`);

    return response.data;
  }

}

const statusApi = new StatusApi(address);
export default statusApi;
