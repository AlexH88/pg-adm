import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {block} from 'bem-cn';
// import { bind } from 'decko';
import {actions as thisActions} from '../../redux';
import './style.styl';
import {IReduxState} from 'shared/types/app';
import {actions} from '../../../../features/showResource/redux';
import SmtpSettingsForm from './forms/SmtpSettingsForm';

interface IStateProps {
	featuresData: any;
	isLoading: any;
}

interface IDispatchProps {
	loadCurrentOperator: typeof actions.loadCurrentOperator;
	loadSmtpConfig: typeof thisActions.loadSmtpConfig;
	saveSmtpConfig: typeof thisActions.saveSmtpConfig;
}

function mapState(state: IReduxState): IStateProps {
  return {
		featuresData: state.settings.featuresData,
		isLoading: state.settings.isLoading,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
		loadCurrentOperator: actions.loadCurrentOperator,
		loadSmtpConfig: thisActions.loadSmtpConfig,
		saveSmtpConfig: thisActions.saveSmtpConfig,
  }, dispatch);
}

class Smpt extends React.Component<IStateProps & IDispatchProps, {}> {

	componentDidMount() {
		const { loadCurrentOperator, loadSmtpConfig } = this.props;
		loadCurrentOperator();
		loadSmtpConfig();
	}

  private b = block('smtp');

  public render() {
		const b = this.b;
		const { saveSmtpConfig } = this.props;

    return (
        <div className={b()}>
					<div className="filter-resource">
						<div className="filter-resource__title">
							{
							"Настройки > Настройки почты".split('>').map((item, index) => {
									return (
										<span key={index}>{index !== 0 ? <span className="big-dot">&#903;</span> : null}{item}</span>
									)
								})
							}
						</div>
					</div>
					<div className={b('container')}>
							<SmtpSettingsForm 
								onSave={saveSmtpConfig}
							/>
					</div>
        </div>
    );
  }

  // @bind
  // private onChangeFeatures(featureName: Feature, newState: boolean) {
	// 	const { featuresData } = this.props;
	// 	const { setFeaturesData } = this.props;

	// 	const newFeaturesData = {
	// 		...featuresData,
	// 		[featureName]: featureName === 'local_agent_start_delay' ? Number(newState) : newState,
	// 	};

	// 	setFeaturesData(newFeaturesData);
	// }

	// @bind
	// private onSubmitFeatures() {
	// 	const { featuresData } = this.props;
	// 	const { saveFeatures } = this.props;
	// 	saveFeatures(featuresData);
	// }

}

// export { Features };
export default connect<IStateProps, IDispatchProps, {}>(mapState, mapDispatchToProps)(Smpt);
