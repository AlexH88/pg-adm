import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {actions as thisActions} from '../../redux';
import './style.styl';
import {IReduxState} from 'shared/types/app';
import Checkbox from '../../../../shared/view/elements/Checkbox/index';
import {actions} from '../../../../features/showResource/redux';
import Button from '../../../../shared/view/elements/Button/index';
import {TextInput} from 'shared/view/elements';
import i18next from "i18next";

interface IStateProps {
	featuresData: any;
	isLoading: any;
}

interface IDispatchProps {
	loadCurrentOperator: typeof actions.loadCurrentOperator;
	loadFeatures: typeof thisActions.loadFeatures;
	saveFeatures: typeof thisActions.saveFeatures;
	setFeaturesData: typeof thisActions.setFeaturesData;
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
		loadFeatures: thisActions.loadFeatures,
		saveFeatures: thisActions.saveFeatures,
		setFeaturesData: thisActions.setFeaturesData,
  }, dispatch);
}

type Feature = 'snpm' | 'rfid' | 'local_agent_start_delay';

class Features extends React.Component<IStateProps & IDispatchProps, {}> {
	private b = block('features');

	componentWillMount() {
		const { loadCurrentOperator/*, loadFeatures*/ } = this.props;
		loadCurrentOperator();
		// loadFeatures();
	}

  public render() {
    const b = this.b;
    const { featuresData, isLoading } = this.props;

    return (
        <div className={b()}>
					<div className="filter-resource">
						<div className="filter-resource__title">
							<span>{i18next.t('Features.settings')} </span>
							<span><span className="big-dot">&#903;</span>{i18next.t('Features.functional')}</span>
						</div>
					</div>
					<div className={b('container')}>
							<b>{i18next.t('Features.snmp')}</b>
						<div className={b('container_feature')}>
							<Checkbox
								onChange={this.onChangeFeatures.bind(this, 'snmp')}
								checked={featuresData.snmp}
								disabled={isLoading}
								label={i18next.t('Features.activate')}
							/>
						</div>
						<div className={b('container_feature')}>
							<Checkbox
								onChange={this.onChangeFeatures.bind(this, 'rfid')}
								checked={featuresData.rfid}
								label={featuresData.activateRFID}
								disabled={isLoading}
							/>
						</div>
						<hr  style={{width: '500px', margin: '20px 0 20px 0'}}/>
							<b>{i18next.t('Features.settingdLocalAgent')}</b>
						<div className={b('container_feature')}>
							<Checkbox
								onChange={this.onChangeFeatures.bind(this, 'per_page_printing')}
								checked={featuresData.per_page_printing}
								label={i18next.t('Features.constPrint')}
								disabled={isLoading}
							/>
						</div>
						<div className={b('container_feature')}>
							<Checkbox
								onChange={this.onChangeFeatures.bind(this, 'ask_card_id')}
								checked={featuresData.ask_card_id}
								label={i18next.t('Features.blockPrint')}
								disabled={isLoading}
							/>
						</div>
						<div style={{width: '500px', marginLeft: '15px'}}>
						<TextInput
							onChange={this.onChangeFeatures.bind(this, 'local_agent_start_delay')}
							value={featuresData.local_agent_start_delay}
							disabled={!featuresData.ask_card_id}
							label={i18next.t('Features.tiemout')}
							type="number"
							minValue={0}
						/>
						</div>
						<div className={b('container_submit')}>
							<Button
								label={i18next.t('Features.apply')}
								onClick={this.onSubmitFeatures}
								isPrimary
								disabled={isLoading}
							/>
						</div>
					</div>
        </div>
    );
  }

  @bind
  private onChangeFeatures(featureName: Feature, newState: boolean) {
		const { featuresData } = this.props;
		const { setFeaturesData } = this.props;

		const newFeaturesData = {
			...featuresData,
			[featureName]: featureName === 'local_agent_start_delay' ? Number(newState) : newState,
		};

		setFeaturesData(newFeaturesData);
	}

	@bind
	private onSubmitFeatures() {
		const { featuresData } = this.props;
		const { saveFeatures } = this.props;
		saveFeatures(featuresData);
	}

}

// export { Features };
export default connect<IStateProps, IDispatchProps, {}>(mapState, mapDispatchToProps)(Features);
