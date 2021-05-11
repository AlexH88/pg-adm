import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {actions as thisActions} from '../../redux';
import './style.styl';
import {IReduxState} from 'shared/types/app';
import {actions} from '../../../../features/showResource/redux';
import Button from '../../../../shared/view/elements/Button/index';
import {Modal} from 'shared/view/components';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import * as circularTheme from './circularTheme.styl';
import {SetLicenseForm} from 'modules/Settings/view/About/SetLicenseForm/AddBlockedPrinter';
import {ILicense} from 'modules/Snmp/namespace';
import i18next from "i18next";

interface IStateProps {
	featuresData: any;
	isLoading: any;
	currentVersion: any;
	availableVersions: any[];
	showUpdateDialog: boolean;
	showBlockDialog: boolean;
	licenseData: ILicense;
	showLicenseDialog: boolean;
}

interface IDispatchProps {
	loadCurrentOperator: typeof actions.loadCurrentOperator;
	getCurrentVersion: typeof thisActions.getCurrentVersion;
	getAvailableVersions: typeof thisActions.getAvailableVersions;
	executeUpdate: typeof thisActions.executeUpdate;
	switchUpdateModal: typeof thisActions.switchUpdateModal;
	startEditLicenseInfo: typeof thisActions.startEditLicenseInfo;
	saveLicenseInfo: typeof thisActions.saveLicenseInfo;
	getLicenseInfo: typeof thisActions.getLicenseInfo;
	switchLicenseModal: typeof thisActions.switchLicenseModal;
}

function mapState(state: IReduxState): IStateProps {
  return {
		featuresData: state.settings.featuresData,
		isLoading: state.settings.isLoading,
		currentVersion: state.settings.currentVersion,
		availableVersions: state.settings.availableVersions,
		showUpdateDialog: state.settings.showUpdateDialog,
		showBlockDialog: state.settings.showBlockDialog,
		showLicenseDialog: state.settings.showLicenseDialog,
		licenseData: state.settings.licenseData,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
		loadCurrentOperator: actions.loadCurrentOperator,
		getCurrentVersion: thisActions.getCurrentVersion,
		getAvailableVersions: thisActions.getAvailableVersions,
		executeUpdate: thisActions.executeUpdate,
		switchUpdateModal: thisActions.switchUpdateModal,
		startEditLicenseInfo: thisActions.startEditLicenseInfo,
		saveLicenseInfo: thisActions.saveLicenseInfo,
		getLicenseInfo: thisActions.getLicenseInfo,
		switchLicenseModal: thisActions.switchLicenseModal,
  }, dispatch);
}

class About extends React.Component<IStateProps & IDispatchProps, {}> {

	componentDidMount() {
		const { getCurrentVersion, getAvailableVersions, loadCurrentOperator, getLicenseInfo } = this.props;
		getCurrentVersion();
		getAvailableVersions();
		loadCurrentOperator();
		getLicenseInfo();
	}

  private b = block('features');

  public render() {
    const b = this.b;
		const { showUpdateDialog, currentVersion, availableVersions, showBlockDialog, licenseData, showLicenseDialog } = this.props;
		const { switchUpdateModal, switchLicenseModal, startEditLicenseInfo, saveLicenseInfo } = this.props;

    return (
        <div className={b()}>
					{
						showBlockDialog ?
						<div className={b('block')}>
							<ProgressBar theme={circularTheme} type="circular" mode="indeterminate" />
						</div>
						:
						null
					}
					<Modal
						title={i18next.t('About.header')}
						isOpen={showUpdateDialog}
						onClose={switchUpdateModal}
					>
					<div className={b('footer')}>
						<Button
							label={i18next.t('About.Not')}
							onClick={switchUpdateModal}
						/>
						<Button
							label={i18next.t('About.Yes')}
							onClick={this.onStartUpdate}
							isPrimary
						/>
        	</div>
					</Modal>
					<Modal
						title={i18next.t('About.license')}
						isOpen={showLicenseDialog}
						onClose={switchLicenseModal}
					>
						<SetLicenseForm
							onSave={saveLicenseInfo}
							onCancel={switchLicenseModal}
						/>
					</Modal>
					<div className="filter-resource">
						<div className="filter-resource__title">
							{
							"О программе".split('>').map((item, index) => {
									return (
										<span key={index}>{index !== 0 ? <span className="big-dot">&#903;</span> : null}{item}</span>
									)
								})
							}
						</div>
					</div>
					<div className={b('container')}>
						<div className={b('container_version')}>
							Текущая версия: <span className={b('blue-text')}>{currentVersion}</span>
						</div>
						<div className={b('container_available')}>
							<div className={b('container_available_title')}>
								{i18next.t('About.versions')}
							</div>
							<div className={b('container_available_content')}>
							{
								availableVersions.length !== 0 ?
								<ul className={b('container_available_list')}>
									{
										availableVersions.map((item, index) => (
											<li className={b('container_available_list-item')} key={index}><span className={b('blue-text')}>{item.version}</span></li>
										))
									}
								</ul>
								:
								<span className={b('blue-text')}>{i18next.t('About.notVersions')}</span>
							}
							</div>
						</div>
						<div className={b('container_submit')}>
							<Button
								disabled={availableVersions.length === 0}
								label={i18next.t('About.update')}
								onClick={switchUpdateModal}
								isPrimary
							/>
						</div>
					</div>
						<hr style={{marginTop: '40px'}}/>
					<div className="filter-resource">
						<div className="filter-resource__title">
							{
							"Лицензия".split('>').map((item, index) => {
									return (
										<span key={index}>{index !== 0 ? <span className="big-dot">&#903;</span> : null}{item}</span>
									)
								})
							}
						</div>
					</div>
					<div className={b('container')}>
						{
							licenseData ?
							<div>
								<span className={b('license-tilte')}>{i18next.t('About.currentLicense')}</span>
								<ul>
									{licenseData.printersCount && <li><b>{i18next.t('About.numberPrinters')}</b><span className={b('blue-text')}>{licenseData.printersCount}</span></li>}
									{licenseData.usersCount && <li><b>{i18next.t('About.numberUsers')} </b><span className={b('blue-text')}>{licenseData.usersCount}</span></li>}
									{licenseData.connectionsCount && <li><b>{i18next.t('About.numberCompounds')} </b><span className={b('blue-text')}>{licenseData.connectionsCount}</span></li>}
									<li><b>{i18next.t('About.valid')} </b><span className={b('blue-text')}>{this.formatDate(licenseData.stopDate as any)}</span></li>
								</ul>
							</div>
							:
							<div className={b('license-tilte')}>{i18next.t('About.notLicense')}</div>
						}
						<Button label={i18next.t('About.installLicense')} isPrimary onClick={startEditLicenseInfo} />
					</div>
        </div>
    );
	}

	@bind
	formatDate(dateString: number | string) {

		const drawZero = (date: number) => (
			date > 9 ? `${date}` : `0${date}`
		);
		const date = new Date(typeof(dateString) === 'string' ? dateString as any : ((dateString as any) * 1000));
		return `${drawZero(date.getHours())}:${drawZero(date.getMinutes())}:${drawZero(date.getSeconds())} ` +
			`${drawZero(date.getDate())}.${drawZero(date.getMonth()+1)}.${date.getFullYear()}`;
	}

	@bind
	private onStartUpdate() {
		const { executeUpdate } = this.props;
		executeUpdate();
	}

}

// export { Features };
export default connect<IStateProps, IDispatchProps, {}>(mapState, mapDispatchToProps)(About);
