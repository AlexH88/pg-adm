import Api from "shared/api/Api";
import {address} from 'shared/api/HttpActions';
import {bind} from 'decko';
import {IPeriod} from "../namespace/apiCommunication";
import {getNormalizeFilterConfigs} from "shared/helpers/getConfig";

class UserReportsApi extends Api {
	constructor(public baseUrl: string) {
		super(baseUrl);
	}

	@bind
	public async getUserTimereports(interval: IPeriod, filterConfigs: any): Promise<any> {
		const filters = getNormalizeFilterConfigs(filterConfigs);
		console.log('NORMALIZE filterConfigs & filters');
		console.log(filterConfigs);
		console.log(filters);

		// function makeNormalFilterObject(object: any) { // TODO
		// 	for(let item in object) {
		// 		object[item] = typeof object[item] === 'object' ? object[item][0] : object[item];
		// 	}
		// 	return object;
		// }

		// const response = await this.actions.get<any>(`api/table/user_timereports?interval=${interval}`, makeNormalFilterObject(filters));
		const response = await this.actions.get<any>(`api/table/user_timereports?interval=${interval}`, filters);

		console.log('RESPONSE ON API_getUserTimereports:');
		console.log(response);

		return response.data;
	}

	@bind
	public async getUserGroupsTimereports(interval: IPeriod, filterConfigs: any): Promise<any> {
		const filters = getNormalizeFilterConfigs(filterConfigs);

		const response = await this.actions.get<any>(`api/table/user_groups_timereports?interval=${interval}`, filters);

		console.log('RESPONSE ON API_getUserGroupsTimereports:');
		console.log(response);

		return response.data;
	}

	@bind
	public async getPrinterTimereports(interval: IPeriod, filterConfigs: any): Promise<any> {
		const filters = getNormalizeFilterConfigs(filterConfigs);

		const response = await this.actions.get<any>(`api/table/printer_timereports?interval=${interval}`, filters);

		console.log('RESPONSE ON API_getPrinterTimereports:');
		console.log(response);

		return response.data;
	}

	@bind
	public async getPrinterGroupsTimereports(interval: IPeriod, filterConfigs: any): Promise<any> {
		const filters = getNormalizeFilterConfigs(filterConfigs);

		const response = await this.actions.get<any>(`api/table/printer_groups_timereports?interval=${interval}`, filters);

		console.log('RESPONSE ON API_getPrinterGroupsTimereports:');
		console.log(response);

		return response.data;
	}


}

const userReportsApi = new UserReportsApi(address);
export { userReportsApi };
export default UserReportsApi;


