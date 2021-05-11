import * as React from 'react';
import {block} from 'bem-cn';

import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState} from 'shared/types/app';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import {Modal, RemoveModal} from 'shared/view/components';
import ConfirmationModal from 'shared/view/components/ConfirmationModal';
import {IPolicy} from 'shared/types/policy';
import {actions} from '../../redux';
import {actions as showResourceActions} from '../../../../features/showResource/redux';
import {selectors} from '../../redux/actions';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {IAgregate, IChoosenEditPolicy} from '../../namespace';
import {Checkbox, Icon} from 'shared/view/elements';
import {getDaysFromMask, getHoursFromMask, getPolicyById} from 'shared/helpers/formatData';


import injectResource from 'shared/helpers/injectResource';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import AddAgentPolicyForm from '../components/AddAgentPolicyForm';
import i18next from "i18next";

import './style.styl';

interface IDispatchProps {
  activatePolicy: typeof actions.activateResource;
  deactivatePolicy: typeof actions.deactivateResource;
  deletePolicy: typeof actions.deleteResource;
  acceptDelete: typeof actions.acceptDelete;
  switchRemoveModal: typeof actions.switchRemoveModal;
  switchModalStatus: typeof actions.switchModalStatus;
  createPolicy: typeof actions.createResource;
  setEditPolicy: typeof actions.setEditPolicy;
  switchConfirmModal: typeof actions.switchConfirmModal;
  loadCurrentOperator: typeof showResourceActions.loadCurrentOperator;
  startEditPolicy: typeof actions.startEditPolicy;
  loadHostGroups: typeof actions.loadHostGroups,
  saveEditPolicy: typeof actions.saveResource,
}

interface IStateProps {
  headers: FilterResourseNS.IHeader[];
  configHeaders: IConfigHeaders;
  configAggregates: IAgregate[];
  showRemoveModal: boolean;
  showCreateEditModal: boolean;
  showConfirmModal: boolean;
  policiesData: IPolicy[][];
  choosenPolicyEdit: IChoosenEditPolicy | null;
  currentOperator: any;
  userGroups: any[];
  printerGroups: any[];
  hostGroups: any[];
}

interface ILocation {
  location: any;
}


type Props = IDispatchProps & IStateProps & ILocation;

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'agent_policies'),
    configHeaders: getHeadersConfig('agent_policies', state),
    configAggregates: getAggregates('agent_policies', state),
    showRemoveModal: state.policy.showRemoveModal,
    showCreateEditModal: state.policy.showCreateEditModal,
    showConfirmModal: state.policy.showConfirmModal,
    choosenPolicyEdit: state.policy.choosenPolicyEdit,
    policiesData: selectors.getPoliciesData(state),
    userGroups: state.policy.userGroups,
    printerGroups: state.policy.printerGroups,
    hostGroups: state.policy.hostGroups,
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    activatePolicy: injectResource('agent_policies', actions.activateResource),
    deactivatePolicy: injectResource('agent_policies', actions.deactivateResource),
    deletePolicy: injectResource('agent_policies', actions.deleteResource),
    createPolicy:  injectResource('agent_policies', actions.createResource),
    startEditPolicy: actions.startEditPolicy,
    switchRemoveModal: actions.switchRemoveModal,
    switchModalStatus: actions.switchModalStatus,
    acceptDelete: actions.acceptDelete,
    setEditPolicy: actions.setEditPolicy,
    switchConfirmModal: actions.switchConfirmModal,
    loadHostGroups: actions.loadHostGroups,
    saveEditPolicy: actions.saveResource,
    loadCurrentOperator: showResourceActions.loadCurrentOperator,
  }, dispatch);
}

const b = block('policies');

class AgentPolicies extends React.PureComponent<Props, {}> {

  public componentDidMount() {
    const { policiesData, choosenPolicyEdit } = this.props;
    const policy = policiesData && choosenPolicyEdit ? getPolicyById(policiesData, choosenPolicyEdit.id) : {};
    if (this.checkRedirectAndActivePolicy(policy as IPolicy)) {
      this.props.switchConfirmModal();
    }
    this.props.loadHostGroups();
  }

  public render() {
    const { headers, configHeaders, configAggregates, acceptDelete, showRemoveModal, switchRemoveModal } = this.props;
    const { switchModalStatus, showCreateEditModal, switchConfirmModal, currentOperator = {} } = this.props;
    const { showConfirmModal } = this.props;
    return (
        <div className={b()}>
          <FilterResource
            configs={configHeaders}
            resource="agent_policies"
            label={i18next.t('AgentPolicies.header')}
          />
          <ShowResource
            onAdd={currentOperator['policies.post'] ? this.onEditPolicy.bind(this, null, 'create') : null}
            resource="agent_policies"
            headers={headers}
            configs={{
              sort: {
                by: 'name',
                order: 'asc',
              },
            }}
            aggregateStats={configAggregates}
            //@ts-ignore
            actionsFormatter={this.actionsFormatter}
            headersFormatter={this.fieldFormatter}
            configHeadersTable={configHeaders}
          />
          <Modal
            isOpen={showCreateEditModal}
            title={i18next.t('AgentPolicies.policySettings')}
            onClose={() => {switchModalStatus({status: false, mode: ''})}}
          >
          // @ts-ignore
            <AddAgentPolicyForm
              onCancel={() => {switchModalStatus({status: false, mode: ''})}}
              onSave={this.onCreatePolicy}
            />
          </Modal>
          <RemoveModal
            isOpen={showRemoveModal}
            alertMessage="Политика будет удалена из базы!"
            onClose={switchRemoveModal}
            onRemove={acceptDelete}
          />
          <ConfirmationModal
            isOpen={showConfirmModal}
            alertMessage=""
            title={i18next.t('AgentPolicies.activatePolicy')}
            onClose={switchConfirmModal}
            onConfirm={this.onConfirmActivatePolicy}
          />
        </div>
    );
  }

  @bind
  private onConfirmActivatePolicy() {
    const { choosenPolicyEdit, activatePolicy, switchConfirmModal } = this.props;
    if (choosenPolicyEdit) {
      activatePolicy(choosenPolicyEdit.id);
      switchConfirmModal();
    }
  }

  @bind
  private checkRedirectAndActivePolicy(policy: IPolicy): boolean {
    return Object.keys(this.props.location.query).length > 0
    && this.props.location.query.tryActivate === 'true'
    && policy && policy.state === false;
  }

  @bind
  private onClickCheckbox(id: number, value: boolean): void {
    const { activatePolicy, deactivatePolicy } = this.props;
    if (value) {
      activatePolicy(id);
    } else {
      deactivatePolicy(id);
    }
  }

  @bind
  private fieldFormatter(field: any, row: any): JSX.Element | string | number | boolean {
    const { hostGroups } = this.props;
    if (field === 'state') {
      return (
        <span className={b('state')} >
          <Checkbox
            label=""
            checked={Boolean(row.state)}
            onChange={this.onClickCheckbox.bind(this, row.id)}
          />
      </span>
      )
    }
    if (field === 'hours') {
      return getHoursFromMask(row[field]);
    }
    if (field === 'days') {
      return getDaysFromMask(row[field]);
    }
    if (field === 'hostgroups') {
      return (
        hostGroups.filter((group: any) => row[field].indexOf(group.id) !== -1 ).map((group: any) => group.name ).join(', ')
      )
    }
    if (field === 'value') {
      return (
        row[field] ? `${i18next.t('AgentPolicies.activates')}` : `${i18next.t('AgentPolicies.deactivates')}`
      )
    }
    return row[field];
  }

  @bind
  private actionsFormatter(field: string, row: IPolicy): JSX.Element | null {
    const { currentOperator = {} } = this.props;
    if (field === 'actions') {
      return (
        <div>
          {/*<span className={b('state')}>*/}
            {/*<Checkbox*/}
              {/*label=""*/}
              {/*checked={Boolean(row.state)}*/}
              {/*onChange={this.onClickCheckbox.bind(this, row.id)}*/}
            {/*/>*/}
          {/*</span>*/}
          {currentOperator['policies.delete'] ?
              <Icon key={row.id} icon="trash" onClick={this.tryDeletePolicy.bind(this, row.id)}/>
              :
              null
          }
          {currentOperator['policies.put'] ?
              <Icon icon="pen" onClick={this.onEditPolicy.bind(this, row, 'edit')}/>
              :
              null
          }
        </div>
      );
    }
    return null;
  }

  @bind
  private async onCreatePolicy() {
    const { saveEditPolicy } = this.props;
    saveEditPolicy();
  }

  @bind
  private onEditPolicy(rowData: any) {
    const { startEditPolicy } = this.props;
    startEditPolicy(rowData);
  }

  @bind
  private tryDeletePolicy(id: number) {
    const { switchRemoveModal, deletePolicy } = this.props;
    switchRemoveModal();
    deletePolicy(id);
  }

}

export { AgentPolicies };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(AgentPolicies);
