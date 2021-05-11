import qs from 'qs';
import { bind } from 'decko';
import { Namespace as EditNamespace } from 'features/editGroups';
import { Namespace as FilterResourceNamespace } from 'features/filterResource';
import { Namespace as ShowResourceNamespace } from 'features/showResource';
import { IData } from 'modules/Settings/namespace';
import { sendRoleDataConverter } from 'shared/api/converters/role';
import { getNormalizeFilterConfigs } from 'shared/helpers/getConfig';
import { getResourceUrl } from 'shared/helpers/resourceConvertion';
import { IFiltersResponse, IOperator, IResource, ISyncData } from 'shared/types/app';
import { IRule } from 'shared/types/policy';
import {
  getRuleDataConverter,
  sendOperatorsDataConverter,
  sendRuleDataConverter
} from './converters';
import HttpActions from './HttpActions';
import {configsDescription} from './mocks/mocks';
import { printServersFiltersMock } from './mocks/printServers';
import SyncApi from './SyncApi';

interface IChangedPassCatalogData {
  url: string;
  pass: string;
  user: string;
}

interface IResourceParameters {
  resource: string;
  page: number;
  sort: ShowResourceNamespace.ISort;
  filterConfigs: FilterResourceNamespace.IFilterConfigs;
}

// ********************************************
interface IResponse {
  aggregate: { totalItems: number }; // f.e. in json "32"
  items: any[];
}
interface ICachedResource {
  [key: number]: IResponse;
}
// ********************************************

let cachedPages: { [ key: string ]: ICachedResource } = {};

class Api {
  public actions: HttpActions;
  public syncApi: SyncApi;

  constructor(baseUrl: string) {
    this.actions = new HttpActions(`${baseUrl}`);
    this.syncApi = new SyncApi(baseUrl);
    setInterval(() => cachedPages = {}, 2.5 * 60 * 1000);
  }

  @bind
  private async makeResourceRequest(
    resource: string,
    sort: ShowResourceNamespace.ISort = {
      by: 'id',
      order: 'asc',
    },
    page: number,
    filterConfigs: FilterResourceNamespace.IFilterConfigs
  ) {
    const filters = getNormalizeFilterConfigs(filterConfigs);

    let requestString;
    let sortPathNodes = '';

    sortPathNodes = `${sort.by}/${sort.order}`;

    if (resource.includes('-')) {
      const pathNodes = resource.split('-');
      requestString = `api/table/${pathNodes[0]}/${page}/${sortPathNodes}?type=${pathNodes[1]}`;
    } else {
      requestString = `api/table/${resource}/${page}/${sortPathNodes}`;
    }

    const response: any = await this.actions.get<ShowResourceNamespace.IResourceResponse>(
      requestString,
      filters
    );
    return response.data;
  }

  @bind
  public async getPrintersList(id: number) { // #PrintServers
    const response = await this.actions.get<ShowResourceNamespace.IResourceSyncData>(
      `/api/table/hosts/sync/${id}`,
    );

    const formattedResponse = {
      ...response,
      data: {
        sync: response.data.filter((printer: any) => printer.synced),
        unsync: response.data.filter((printer: any) => !printer.synced)
      }
    }
    return formattedResponse;
  }

  @bind
  public async removeAgent(id: number) { // #PrintServers
    const response = await this.actions.del(`/api/table/hosts/${id}`);
    return response;
  }

  @bind
  public async syncPrinterData(id: number, data: any) {
    const response = await this.actions.put<any>(`/api/table/hosts/sync/${id}/printer/${data.name}`, data);
    return response;
  }

  @bind
  public async unsyncPrinterData(id: number, data: any) {
    const response = await this.actions.del<any>(`/api/table/hosts/sync/${id}/printer/${data.name}`);
    return response;
  }

  @bind
  public async getCatalogsList(catalogName: string) { // #PrintServers
    // try {
    // if(!1)
    const response = await this.actions.get<ShowResourceNamespace.IResourceSyncData>(`/api/table/catalogs/sync/${catalogName}`);
    // } catch (e) {}
    // if (!1) console.log(response);
    // return syncUnsyncCatalogs;
    // response = {
    //   data: {
    //     'sync': 'asdasdaIasdadadasdIasdIasdasdIdsdsddsdIxcvxcvxcvxIasdasdasdadaIvcbcvbcvbvcIas2dIas44dasdIdsdsdasddsdIxcv123xcvxcvxIasdasda12sdadaIvcbcvbclklkvbvc'.split('I'),
    //     'unsync': 'asd2asdaIasdad123adfasdIassddIasd4gasdIdsdsddffsdIasdasd123asdadaIvcbcvbcvbvc'.split('I'),
    //   }
    // };

    return response;
  }

  @bind
  public async syncCatalogsData(catalogName: string, data: ISyncData) { // #PrintServers
    // try {
    const response = await this.actions.post<any>(`/api/table/catalogs/sync/${catalogName}`, data);
    // } catch (e) {
    //   if (!1) console.log(response);
      // return syncUnsyncCatalogs;
    return response;
    // }
  }

  @bind
  public async sendLoginData(data: any) {
    const response = await this.actions.post<any>(`/check_operator`, data);
    return response;
  }

  @bind
  public async getAuthoritiesCurrent(): Promise<any> {
    const response = await this.actions.get<any>(`/api/table/operators/current`);
    return response;
  }

  @bind
  public async logout() {
     const response = await this.actions.get<any>('/api/session/logout');
    return response;
  }


  @bind
  private async cacheData({ resource, page, sort, filterConfigs }: IResourceParameters) {
    if (!cachedPages.hasOwnProperty(resource)) {
      cachedPages[resource] = {};
    }

    const cachedResource: ICachedResource = cachedPages[resource];
    let result: ICachedResource = {};
    let totalItems: number = 0;

    // to calculate if we already cached all items
    function checkTotalCachedItems() {
      return Object.values(cachedResource)
        .map((p: IResponse) => p.items)
        .reduce((accum, currValue) => accum + currValue.length, 0);
    }
    // cachedResource = userMocks;

    // current page
    if (!cachedResource.hasOwnProperty(page)) {
      cachedResource[page] = await this.makeResourceRequest(resource, sort, page, filterConfigs);
      result[page] = cachedResource[page];
      totalItems = Number(cachedResource[page].aggregate.totalItems);
    }
    // previous page
    if (
      checkTotalCachedItems() < totalItems
      && !cachedResource.hasOwnProperty(page - 1)
      && page - 1 >= 0
    ) {
      cachedResource[page - 1] = await this.makeResourceRequest(resource, sort, page - 1, filterConfigs);
      result[page - 1] = cachedResource[page - 1];
    }
    // next page -  make api call only if more items left
    if (
      checkTotalCachedItems() < totalItems
      && !cachedResource.hasOwnProperty(page + 1)
    ) {
      cachedResource[page + 1] = await this.makeResourceRequest(resource, sort, page + 1, filterConfigs);
      result[page + 1] = cachedResource[page + 1];
    }

    return  result;
  }

  @bind
  public async loadConfigDescription(): Promise<any> {
    // TODO fix typing
    // const response: Axios.AxiosXHR<IFiltersResponse> = await this.actions.get<IFiltersResponse>(`/api/description`);
    
    const response = configsDescription;
    return response;
  }

  @bind
  public async loadBaseTemplate(): Promise<any> {
    const {data} = await this.actions.get('/api/table/settings/mail');
    return data;
  }

  @bind
  public async loadResource(
      resource: string,
      page: number = 0,
      sort: ShowResourceNamespace.ISort,
      filterConfigs: FilterResourceNamespace.IFilterConfigs,
      cacheMode: boolean = false,
      search: string = ''
  ): Promise<any> /* TODO: fix */ {
    
    // TODO KOCTbIJIb
    if (resource === 'mib') {
      resource = 'snmp';
    }

    if(resource == 'events' || resource == 'agentlogs') {
      sort = {by: "date", order: "desc"}
    }

    if (cacheMode) {
      return await this.cacheData({ resource, page, filterConfigs, sort });
    }
    cachedPages[resource] = {};
    let response: IResponse;

    if (resource === 'investigation'){
      return
    }

    let reportData = ''
    if(localStorage.getItem('reportDate')) {
      let date = JSON.parse(localStorage.getItem('reportDate'))
      reportData=`?startDate=${date.startDate}&endDate=${date.endDate}`
    } else {
      reportData = ''
    }

    if (resource === 'reports'){
      const {data} = await this.actions.get(`api/table/staticJobReport/user/${page}/name/asc${reportData}`);
      response = data;
    } else if (resource === 'report_by_printers') {
      const {data} = await this.actions.get(`api/table/staticJobReport/printer/${page}/printer/asc${reportData}`);
      response = data;
    } else if (resource === 'report_by_group_users') {
      const {data} = await this.actions.get(`api/table/staticJobReport/userGroup/${page}/user/asc${reportData}`);
      response = data;
    } else if (resource === 'report_by_group_printers') {
      const {data} = await this.actions.get(`api/table/staticJobReport/printerGroup/${page}/user/asc${reportData}`);
      response = data;
    } else if (resource === 'catalogs') {
      const {data} = await this.actions.get('/api/table/catalog/sources/paged');
      response = data;
    } else if (resource === 'integration'){
      const {data} = await this.actions.get(`api/table/mail/0/id/desc`);
      response = data;
    } else if (resource === 'roles') {
      const {data} = await this.actions.get<any>('/api/table/roles');
      response = data;
    } else if (resource === 'blockedprinters') {
      const {data} = await this.actions.get<any>('/api/table/blockedprinters');
      let modifyItems=[];
      data.items.forEach(el => {
        modifyItems.push({driver: el})
      })
      data.items = modifyItems
      response = data;
    } else if (resource === 'operators') {
      const {data} = await this.actions.get<any>(`/api/table/operators/${page}`);
      response = data;
    } else if(resource === 'userlogs') {
      const {data} = await this.actions.get<any>(`/api/table/${resource}/${page}/date/desc?search=${search}`);
      response = data
    }
     else if (resource === 'floors') {
      const {data} = await this.actions.get<any>('/api/table/floors');
      response = data;
    }
    // else if (resource === 'event_logs') {
    //   const {data} = await this.actions.get<any>(`/api/table/events/${page}/date/asc`);
    //   response = data;
    // } 
    else if (resource === 'snmp_config') {
      const {data} = await this.actions.get<any>('/admin_settings/snmp');
      response = {
        items: Object.keys(data).map((k: any, index: number) => {

          const configEntry: any = {};
          configEntry.name = k;
          configEntry.id = index;
          configEntry.data = data[k];
/*
          data[k].forEach((d: any) => {
            configEntry[`${d.type}_name`] = d.name;
            configEntry[`${d.type}_oidFormula`] = d.oid;
          });
*/
          return configEntry;
        }),
        aggregate: {
          totalItems: Object.keys(data).length
        }
      };
    } else {
      let p = Object.keys(filterConfigs)[0];
      if(Object.keys(filterConfigs).length !=0 && filterConfigs[p] == '') {
          if(resource === 'users') {
            response = await this.makeResourceRequest(resource, sort, page, filterConfigs);
            return { [page]: response };
          }
        return {};
      }
      response = await this.makeResourceRequest(resource, sort, page, filterConfigs);
    }
    return { [page]: response };
  }

  @bind
  public async loadSearchOptions(searchString: string, page: number = 0, resource: string): Promise<any> {
    let response;

    if(resource === 'floors' && searchString !== ''){
      response = await this.actions.get<any>(`/api/table/printers/${page}/id/asc?type=floor&name=${searchString}`);
      return response.data.items
    } else if(resource === 'floors' && searchString === ''){
      response = await this.actions.get<any>(`api/table/printers/0/id/asc?type=floor`);
      return response.data.items;
    } else {
      response  = await this.actions.get<any>(`/api/table/${resource}/${page}/date/asc?search=${searchString}`);
      return response.data;
    }
    // return getRuleDataConverter(response.data.data);

  }

  public async fetchBranchingOptions(convertedPath: string[], filterParameter: string, searchString: string): Promise<any> {
    const composedFilters = await Promise.all(convertedPath.map(async(path) => {
      const response = await this.actions.get<any>(`/api/filters/${path}?${filterParameter}=${searchString}`);
      return response.data.filters;
    }));
    let output: any[] = [];
    composedFilters.forEach(filterGroup => {
      output = [...output, ...filterGroup];
    })
    return output;
  }

  @bind
  public async loadFilterOptions(searchString: string, filterSubgroup: string, filterParameter: string, resource: string): Promise<any> {
    let convertedPath: string[] = [];
    switch(resource) {
      case 'hosts-local':
      case 'hosts-network':
      case 'printers-local':
      case 'printers-network':
        if (filterSubgroup === 'hostgroups') {
          convertedPath.push('hostgroups');
        } else {
          convertedPath.push(filterSubgroup.replace('-', '/'));
        }
        break;
      case 'jobs':
        if (filterSubgroup === 'printers') {
          convertedPath = [filterSubgroup + '/local', filterSubgroup + '/network'];
        } else {
          convertedPath.push(filterSubgroup);
        }
        break;
      default:
        convertedPath.push(filterSubgroup);
    }
    let receivedFilters: any[] = [];
    let response: any;
    
    if (convertedPath.length > 1) {
      response = await this.fetchBranchingOptions(convertedPath, filterParameter, searchString);
      receivedFilters = response;
    } else {
      response = await this.actions.get<any>(`/api/filters/${convertedPath[0]}?${filterParameter}=${searchString}`);
      receivedFilters = response.data.filters;
    }
    return receivedFilters;
  }
  

  @bind
  public async loadPolicyRule(id: number): Promise<IRule[]> {
    const response: any = await this.actions.get<any/*NSPolicyModule.IRulesResponse*/>(`api/item/policy/${id}/rules`);
    return getRuleDataConverter(response.data.data);
  }

  @bind
  public async getHashData(data: string): Promise<IRule[]> {
//    const response: any = await this.actions.get<any>(`/api/table/investigation/`, data);
    const response = await this.actions.get<ShowResourceNamespace.IResourceResponse>(`/api/table/investigation/${data}`);
    return response.data;
  }

  @bind
  public async createOperators(data: IOperator): Promise<any> {
    const response = await this.actions.post<any>(`/api/table/operators`, sendOperatorsDataConverter(data));
    return response.data;
  }

  @bind
  public async dowloadReport(data: any): Promise<any> {
    const options = {
      headers: {
        'Access-Control-Expose-Headers': 'Content-Disposition',
        'Access-Control-Allow-Origin': '*'
      },
      responseType: 'arraybuffer'
    };
    const response = await this.actions.post<any>(`/api/table/report/download`, (data), options);
    return response;
  }

  @bind
  public async addBlockedPrinter(data: any): Promise<any> {
    const response = await this.actions.post<any>(`/api/table/blockedprinters`, data);
    return response.data;
  }

  @bind
  public async deleteBlockedPrinter(driverName: string): Promise<any> {
    const data = {printer: driverName}
    const response = await this.actions.del<any>(`/api/table/blockedprinters/`, data);
    return response.data;
  }

  @bind
  public async saveOperatorsChanges(data: IOperator, id: number): Promise<any> {
    const response = await this.actions.put<any>(`/api/table/operators/${id}`, sendOperatorsDataConverter(data));
    return response.data;
  }

  @bind
  public async saveTemplate(data: any, tag: string): Promise<any> {
    const response = await this.actions.put<any>(`/api/table/templates/${tag}`, data);
    return response.data;
  }

  @bind
  public async saveBaseTemplate(data: any): Promise<any> {
    const response = await this.actions.put<any>(`/api/table/settings/mail`, data);
    return response.data;
  }

  @bind
  public async changeRole(data: IData, id: number): Promise<any> {
//    const response = await this.actions.put<any>(`api/table/roles/${id}`, sendRoleDataConverter(data) );
    const response = await this.actions.put<any>(`api/table/roles/${id}`, data );
    return response.data;
  }

  @bind
  public async createRole(data: IData): Promise<any> {
//    const response = await this.actions.post<any>(`api/table/roles`, sendRoleDataConverter(data) );
    const response = await this.actions.post<any>(`api/table/roles`, data );
    return response.data;
  }

  @bind
  public async getAuthorities(): Promise<any> {
    const response = await this.actions.get<any>('/api/table/roles/authorities');
    return response.data;
  }

  @bind
  public async sendPolicyRule(data: IRule[], policyId: number | null) {
    const response =
      await this.actions.post<ShowResourceNamespace.IResourceResponse>
      (`/api/item/policy/${policyId}/rules`, sendRuleDataConverter(data));
    return response.data;
  }

  @bind
  public async loadRuleGroups(name: string) {
    const response = await this.actions.get<ShowResourceNamespace.IResourceResponse>(`api/short/${name}`);
    return response.data;
    // return groupsMocks;
  }

  @bind
  public async createResource(resource: string, resourceItem: any): Promise<any> {
    if(resource === 'catalogs'){
      const response = await this.actions.post<ShowResourceNamespace.IResourceResponse>(`api/table/catalog/sources`, resourceItem);
      return response.data;
    } else {
      const response = await this.actions.post<ShowResourceNamespace.IResourceResponse>(`api/table/${resource}`, resourceItem);
      return response.data;
    }
  }

  @bind
  public async createResourceFloor(resource: string, resourceItem: any): Promise<any> {
    const body = new FormData();
    body.append('floorPicture', resourceItem.floorPicture[0]);
    body.append('floorNumber', resourceItem.floorNumber);

    const response = await this.actions.post<any>(`api/table/${resource}`, body );
    return response.data;
  }

  @bind
  public async editFloorResource(resource: string, resourceItem: any): Promise<any> {
    const body = new FormData();
    body.append('floorPicture', resourceItem.floorPicture[0]);
    body.append('floorNumber', resourceItem.floorNumber);
    body.append('isReplace', 'true');

    const response = await this.actions.post<any>(`api/table/${resource}`, body );
    return response.data;
  }

  @bind
  public async addPrinterToFloar(id: any, floorNumber: any): Promise<any> {
    const body = new FormData();
    body.append('printerId', id);
    body.append('floorNumber', floorNumber);

    const response = await this.actions.post<any>(`/api/table/floors/addprinter`, body );
    return response.data;
  }

  @bind
  public async сhangePassword(oldPassword: any, newPassword: any, repeatNewPassword: any): Promise<any> {
    const body = new FormData();
    body.append('oldPassword', oldPassword);
    body.append('newPassword', newPassword);
    body.append('repeatNewPassword', repeatNewPassword);

    const response = await this.actions.post<any>(`/api/table/operators/changePassword`, body );
    return response.data;
  }

  @bind
  public async addСoordinatesPrinterToFloar(id: any, floorNumber: any, x: any, y: any): Promise<any> {
    const body = new FormData();
    body.append('printerId', id);
    body.append('floorNumber', floorNumber);
    body.append('floorX', x);
    body.append('floorY', y);

    const response = await this.actions.post<any>(`/api/table/floors/addprinter`, body );
    return response.data;
  }

  @bind
  public async deletePrinter(id: any): Promise<any> {
    const body = new FormData();
    body.append('printerId', id);

    const response = await this.actions.post<any>(`/api/table/floors/delprinter`, body );
    return response.data;
  }

  @bind
  public async deleteFloor(id: any): Promise<any> {
    const response = await this.actions.del<any>(`/api/table/floors/${id}`);
    return response.data;
  }

  @bind
  public async loadSnmpPicture(resource: string, floor: any): Promise<any> {
    // const options = {
    //   headers: {
    //     'Access-Control-Expose-Headers': 'Content-Disposition',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   responseType: 'arraybuffer'
    // };
     const response = await this.actions.get<any>(`api/table/${resource}/${floor}`, {},/* options */);
    //  console.log(response.data)

    return response.data;
  }


  @bind
  public async webOn(id: any): Promise<any> {
    const response = await this.actions.post<any>(`/api/table/reader/${id}/enable`);
    return response.data;
  }

  @bind
  public async webOff(id: any): Promise<any> {
    const response = await this.actions.post<any>(`/api/table/reader/${id}/disable`);
    return response.data;
  }

  @bind
  public async sendChoosenFilters(resource: string, nameFilter: string): Promise<any> {
    const response = await this.actions.post<any>(`/api/view/filters/${resource}/${nameFilter}`, {});
    return response.data;
  }

  @bind
  public async editResource(resource: string, data: IResource): Promise<any> {
    if (resource === 'snmp_config') {
      return await this.actions.put<ShowResourceNamespace.IResourceResponse>(
        'admin_settings/snmp',
        data
      );
    } else if (resource === 'catalogs') {
      return await this.actions.put<ShowResourceNamespace.IResourceResponse>(
//        `api/table/${resource}`,
        `/api/table/catalog/sources/${data.id}`,
        data
      );
    } else if (resource === 'users') {
      return await this.actions.put<ShowResourceNamespace.IResourceResponse>(
        `api/table/${resource}/id/${data.id}`,
        data
      );
    } else {

      return await this.actions.put<ShowResourceNamespace.IResourceResponse>(
        `api/table/${resource}/${data.id}`,
        data
      );
    }
  }

  @bind
  public async editSnmpFlag(resourceId: number, snmp_active: boolean): Promise<any> {
    const response = await this.actions.put<any>(`api/snmp/active/${resourceId}`, {snmp_active});
    return response.data;
  }

  @bind
  public async getSnmpFlag(resourceId: number): Promise<any> {
    const response = await this.actions.get<any>(`api/snmp/active/${resourceId}`);
    return response.data;
  }

  @bind
  public async tryDeleteResource(resource: string, id: number): Promise<any> {
    const response = await this.actions.del<ShowResourceNamespace.IResourceResponse>(`api/table/${resource}/try/${id}`);
    return response.data;
  }

  @bind
  public async deleteResource(resource: string, id: number): Promise<any> {
    if (resource === 'users') {
      const response = await this.actions.del<ShowResourceNamespace.IResourceResponse>(`api/table/${resource}/id/${id}`);
      return response.data;
    } else if (resource === 'catalogs') {
      const response = await this.actions.del<ShowResourceNamespace.IResourceResponse>(`api/table/catalog/sources/${id}`);
      return response.data;
    } else {
      const response = await this.actions.del<ShowResourceNamespace.IResourceResponse>(`api/table/${resource}/${id}`);
      return response.data;
    }
  }

  @bind
  public async deleteCheckedUsers(resource: string, data: any): Promise<any> {
    const response = await this.actions.del<ShowResourceNamespace.IResourceResponse>(`api/table/${resource}/deleteusers/`, data);
    return response.data;
  }

  @bind
  public async loadFilters(resource: string): Promise<any> {

    if (['alerts', 'errors', 'actions'].includes(resource)) {
      return {
        filters: [
          {
            name: 'event',
            view: 'По событию',
            type: 'value_filter',
          },
        ],
      };
    }

    if (resource === 'printservers') {
      return printServersFiltersMock; // TODO Заглушка
    } else if (resource === 'printerslocal' || resource === 'printersnetwork' ) {
      resource = 'printers';
    // } else if (resource === 'users') {
    //   return printServersFiltersMock; // TODO Заглушка
    } else if (resource === 'hosts-pc') {
      resource = 'hosts';
    }

    const response: any = await this.actions.get<IFiltersResponse>(`api/filters/${resource}`);
    return response.data;
  }

  @bind
  public async loadCurrentOperator(): Promise<any> {
    const response = await this.actions.get<any>(`api/currentoperator`);
    return response.data.data;
  }

  @bind
  public async loadFeatures(): Promise<any> {
    const response = await this.actions.get<any>(`api/currentoperator`);
    return response.data.features;
  }


  @bind
  public async loadAddPrinters(): Promise<any> {
    const response = await this.actions.get<any>(`api/table/printers/0/id/asc?type=floor`);
    return response.data.items;
  }

  @bind
  public async loadGroups(resource: string): Promise<any> {
    if (resource === 'hosts-network' || resource === 'hosts-local') {
      resource = 'host';
    }
    const response = await this.actions.get<EditNamespace.IUsersResponse>(`api/short/${resource}groups`);
    return response.data;
  }

  @bind
  public async loadShortResource(resource: string, id: number | null): Promise<any> {
    const response = await this.actions.get<any>(`/api/short/${resource}${id ? '/' + id : ''}`);
    return response.data;
  }

  @bind
  public async changeUserGroups(data: any/*[{id: number, groups: number[]}]*/, resource: string): Promise<any> {
    let newData;
    if (resource !== 'users') {
      newData = data.length === 1 ? data[0] : data;
    } else {
      newData = data;
    }

    const response = await this.actions.put<ShowResourceNamespace.IResourceResponse>(
      `api/table/${resource}/groupmembership`,
      newData
    );
    return response.data;
  }

  @bind
  public async saveFeatures(data: any): Promise<any> {
    const response = await this.actions.put<any>(`api/features`, data );
    return response.data;
  }

  @bind
  public async checkChangedCatalogData(data: IChangedPassCatalogData): Promise<any> {
    const response = await this.actions.put<ShowResourceNamespace.IResourceResponse>(`api/table/catalogs/pass`, data);
    return response.data;
  }

  @bind
  public async activateResource(resource: string, id: number): Promise<any> {
    const response = await this.actions.put<ShowResourceNamespace.IResourceResponse>(
      `api/table/${resource}/state/${id}`,
      { state: true },
    );
    return response.data;
  }

  @bind
  public async deactivateResource(resource: string, id: number): Promise<any> {
    const response = await this.actions.put<ShowResourceNamespace.IResourceResponse>(
      `api/table/${resource}/state/${id}`,
      { state: false },
    );
    return response.data;
  }

  @bind
  public async loadSyncData(resource: string): Promise<any> {
    const requestUrl = getResourceUrl(resource);
    if (requestUrl === 'printers/localhost') {
      return;
    } // TODO

    const response = await this.actions.get<{}>(`/api/table/${requestUrl}`);

    // let mockData: any = response.data;
    // mockData.unsync = Array(2500).join('TestTest001;').split(';');

    return response.data;
    // return mockData;
  }

  @bind
  public async trySyncItems(data: ISyncData, resource: string): Promise<any> {
    const response = await this.actions.put<ISyncData>(`api/table/${resource}/sync`, data);
    return response.data;
    // return responseSyncData;
  }

  @bind
  public async tryAsyncItems(data: ISyncData, resource: string): Promise<any> {
    const response = await this.actions.put<ISyncData>(`api/table/${resource}/unsync`, data);
    return response.data;
    // return responseSyncData;
  }

  @bind
  public async syncItems(data: ISyncData, resource: string): Promise<any> {
    const response = await this.actions.post<ISyncData>(`api/table/${resource}/sync`, data);
    return response.data;
    // return responseSyncData;
  }

  @bind
  public async unsyncItems(data: ISyncData, resource: string): Promise<any> {
    const response = await this.actions.post<ISyncData>(`api/table/${resource}/unsync`, data);
    return response.data;
    // return responseSyncData;
  }

  @bind
  public async saveRegularReport(data: any): Promise<any> {
    const response = await this.actions.post<{}>(`api/table/regular_reports`, data);
    return response.data;
    // return responseSyncData;
  }

  @bind
  public async saveReport(data: any): Promise<any> {
  const response = await this.actions.post<any>(`api/report.pdf`, data);

    return response.data;
    // return responseSyncData;
  }

  @bind
  public async getWatermarksSettings(data: any): Promise<any> {
    const response = await this.actions.get<any>(`api/table/watermarks/${data}`);

    return response.data;
  }

  @bind
  public async setWatermarksSettings(id: number, watermarks: any): Promise<any> {
    const response = await this.actions.post<any>('api/table/watermarks', {
      id,
      watermarks
    });

    return response.data;
  }

  @bind
  public async saveTimeReport(data: any): Promise<any> {
    const response = await this.actions.post<any>(`api/timereport.pdf`, data);

    return response.data;
    // return responseSyncData;
  }

/*
  @bind
  public async loadImage(jobId: number, imageId: number): Promise<any> {
    const response = await this.actions
      .get<any>(`/api/table/image/${jobId}/${imageId}`, {}, { responseType: 'arraybuffer' })
      .catch((e: any) => e.response);
    return response;
  }
*/

  @bind
  public async loadImage(jobId: number, imageId: number): Promise<any> {
    try {
      const response = await this.actions.get<any>(`/api/table/image/${jobId}/${imageId}`, {}, { responseType: 'arraybuffer' });
      return response;
    } catch (error) {
        throw {
          status: 500
        };
    }
  }

  @bind
  public async getTokens(
    username: string,
    password: string
  ): Promise<any> {
    const requestConfig = {
      auth: {
        username: 'secret_oauth_client',
        password: '2D98A93FE86A0EAA550AE2AD89264E39',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    const response: any = await this.actions.post(
      `/api/oauth/token`,
      qs.stringify({ username, password, grant_type: 'password' }),
      requestConfig,
    )
    .catch((e: any) => e.response);

    return response;
  }

  @bind
  public async getCurrentUser(): Promise<any> {
    const response = await this.actions.get('/api/session/current');
    return response.data;
  }
/*
  @bind
  public async logout(): Promise<any> {
    const response = await this.actions.get('/api/session/logout');
    return response;
  }
*/

  @bind
  public async enableCatalog(id: number): Promise<any> {
    const response = await this.actions.post<ShowResourceNamespace.IResourceResponse>(`api/table/catalog/sources/${id}/enable`);
    return response;
  }

  @bind
  public async disableCatalog(id: number): Promise<any> {
    const response = await this.actions.post<ShowResourceNamespace.IResourceResponse>(`api/table/catalog/sources/${id}/disable`);
    return response;
  }

  @bind
  public async testCatalogConnection(settings: any): Promise<any> {
    const response = await this.actions.post(`api/table/catalog/test`, settings);
    return response;
  }

  @bind
  public async testMailConnection(settings: any): Promise<any> {
    const response = await this.actions.post(`api/table/mail/connect`, settings);
    return response;
  }

  @bind
  public async enableIntegration(): Promise<any> {
    const response = await this.actions.post<ShowResourceNamespace.IResourceResponse>(`api/table/mail/enable`);
    return response;
  }

  @bind
  public async disableIntegration(): Promise<any> {
    const response = await this.actions.post<ShowResourceNamespace.IResourceResponse>(`api/table/mail/disable`);
    return response;
  }

  @bind
  public async savePostConnection(settings: any): Promise<any> {
    const response = await this.actions.post(`/api/table/mail/save`, settings);
    return response;
  }

  @bind
  public async getCurrentStatusIntegration() {
    const response = await this.actions.get(`/api/table/mail/status`);
    return response;
  }

  @bind
  public async getCatalogs(): Promise<any> {
    const response = await this.actions.get(`api/table/catalog/sources/`);
    return response;
  }

  @bind
  public async getCatalogGroups(id: number): Promise<any> {
    const response = await this.actions.get(`api/table/catalog/sources/${id}/retrievedGroups`);
    return response;
  }

  @bind
  public async catalogSyncStart(id: number): Promise<any> {
    const response = await this.actions.post(`/api/table/catalog/sources/${id}/sync/start`);
    return response;
  }

  @bind
  public async catalogSyncStatus(id: number): Promise<any> {
    const response = await this.actions.get(`/api/table/catalog/sources/${id}/sync/status`);
    return response;
  }

  @bind
  public async updateCatalogGroups(id: number, data: number[]): Promise<any> {
    const response = await this.actions.put(`/api/table/catalog/sources/${id}/retrievedGroups/loggable`, data);
    return response;
  }

  @bind
  public async getPrinterGroup(): Promise<any> {
    const response = await this.actions.get<any>('api/short/printergroups');
    return response.data;
  }

  @bind
  public async updateUsers(data: any): Promise<any> {
    const response = await this.actions.post(`/api/table/users/csv`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      }}
    );
    return response;
  }

}

export default Api;
