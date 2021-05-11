import Api from "shared/api/Api";
import {address} from 'shared/api/HttpActions';
import {bind} from 'decko';
import {ISmtpConfig, ISmtpInfo} from './../namespace';

class SettingsApi extends Api {
  constructor(public baseUrl: string) {
    super(baseUrl);
  }

  @bind
  public async getCurrentVersion() {
    const response = await this.actions.get<any>(`/api/upd/version`);
    return response.data;
  }

  @bind
  public async getAvailableVersions() {
    const response = await this.actions.get<any>(`/api/upd/versions`);
    return response.data;
  }

  @bind
  public async runUpdate() {
    const response = await this.actions.get<any>(`/api/upd/doUpdate`);
    return response.data;
  }

  @bind
  public async getSmtpConfig(): Promise<ISmtpInfo> {
    const response = await this.actions.get<ISmtpInfo>(`/api/smtp`);
    return response.data;
  }

  @bind
  public async setSmtpConfig(config: ISmtpConfig): Promise<any> {
    const response = await this.actions.put<ISmtpConfig>(`/api/smtp`, config);
    return response.data;
  }

  @bind
  public async getLicenseInfo(): Promise<any> {
    const response = await this.actions.get<any>('/api/license');
    return response.data;
  }

  @bind
  public async setLicense(licenseKey: string): Promise<any> {
    const response = await this.actions.put<any>('/api/license', { licenseKey });
    return response.data;
  }

  @bind
  public async addLicense(licenseKey: string): Promise<any> {
    console.log('licenseKey', licenseKey)
    const response = await this.actions.post<any>('/api/table/licenses', licenseKey);
    return response.data;
  }

  @bind
  public async editLicense(id: number, data: any) {

    const body = {
      usersCount: data.usersCount,
      networkPrintersCount: data.networkPrintersCount,
      customerInn: data.customerInn,
      localPrintersCount: data.localPrintersCount,
      manager: data.manager,
      contract: data.contract,
      expirationDate: data.expirationDate,
      customer: data.customer
    }

    const response = await this.actions.put<any>(`api/table/licenses/${id}`, body);
    return response;
  }

}

const settingsApi = new SettingsApi(address);
export { settingsApi };
