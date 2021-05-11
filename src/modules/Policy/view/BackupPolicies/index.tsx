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
import {IAgregate, IChoosenEditPolicy, IMode} from '../../namespace';
import {Checkbox, Icon} from 'shared/view/elements';
import {getStringIds} from 'shared/helpers/formatData';
import injectResource from 'shared/helpers/injectResource';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import {generateIdElement} from 'shared/helpers';
import AddPolicyForm from '../components/AddPolicyForm';
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
  loadHostGroups: typeof actions.loadHostGroups;
  saveEditPolicy: typeof actions.saveResource;
  getGroups: typeof actions.getGroups;
  startEditPolicy: typeof actions.startEditPolicy;
  savePolicy: typeof actions.saveResource;
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
  modalMode: IMode;
}

interface ILocation {
  location: any;
}

type Props = IDispatchProps & IStateProps & ILocation;

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'backup_policy'),
    configHeaders: getHeadersConfig('backup_policy', state),
    configAggregates: getAggregates('backup_policy', state),
    showRemoveModal: state.policy.showRemoveModal,
    showCreateEditModal: state.policy.showCreateEditModal,
    showConfirmModal: state.policy.showConfirmModal,
    choosenPolicyEdit: state.policy.choosenPolicyEdit,
    policiesData: selectors.getPoliciesData(state),
    userGroups: state.policy.userGroups,
    printerGroups: state.policy.printerGroups,
    hostGroups: state.policy.hostGroups,
    modalMode: state.policy.modalMode
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    activatePolicy: injectResource('backup_policy', actions.activateResource),
    deactivatePolicy: injectResource('backup_policy', actions.deactivateResource),
    deletePolicy: injectResource('backup_policy', actions.deleteResource),
    createPolicy:  injectResource('backup_policy', actions.createResource),
    savePolicy: injectResource('backup_policy', actions.saveResource),
    switchRemoveModal: actions.switchRemoveModal,
    switchModalStatus: actions.switchModalStatus,
    acceptDelete: actions.acceptDelete,
    setEditPolicy: actions.setEditPolicy,
    switchConfirmModal: actions.switchConfirmModal,
    loadHostGroups: actions.loadHostGroups,
    saveEditPolicy: actions.saveResource,
    loadCurrentOperator: showResourceActions.loadCurrentOperator,
    getGroups: actions.getGroups,
    startEditPolicy: actions.startEditPolicy
  }, dispatch);
}

const b = block('policies');

class BackupPolicies extends React.PureComponent<Props, {}> {

  public componentDidMount() {
    const { policiesData, choosenPolicyEdit } = this.props;
    this.props.getGroups();
  }

  public render() {
    const { headers, configHeaders, configAggregates, acceptDelete, showRemoveModal, switchRemoveModal } = this.props;
    const { switchModalStatus, showCreateEditModal, switchConfirmModal, currentOperator = {} } = this.props;
    const { showConfirmModal } = this.props;
    return (
        <div className={b()}>
          <FilterResource
            configs={configHeaders}
            resource="backup_policy"
            label={i18next.t('BackupPolicies.header')}
          />
          <ShowResource
            onAdd={currentOperator['policies.post'] ?  () => {switchModalStatus({ status: true, mode: 'create' })} : null}
            resource="backup_policy"
            headers={headers}
            configs={{
              sort: {
                by: 'id',
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
            title={i18next.t('BackupPolicies.policySettings')}
            onClose={() => {switchModalStatus({status: false, mode: ''})}}
          >
            <AddPolicyForm
              onCancel={() => {switchModalStatus({status: false, mode: ''})}}
              onSave={this.onSaveForm}
              policyType="backup"
            />
          </Modal>
          <RemoveModal
            isOpen={showRemoveModal}
            alertMessage={i18next.t('BackupPolicies.deleted')}
            onClose={switchRemoveModal}
            onRemove={acceptDelete}
          />
          <ConfirmationModal
            isOpen={showConfirmModal}
            alertMessage=""
            title={i18next.t('BackupPolicies.activate')}
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
  private async onSaveForm() {
    const { modalMode = '', createPolicy, savePolicy } = this.props;
    if (modalMode === 'create') {
      await createPolicy();
    } else {
      await savePolicy();
    }
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

    if (field === 'userGroups' || field === 'printerGroups') {
      return getStringIds(row[field]);
    }

    if (field === 'operator'){
      return row[field].login
    }

    return row[field];
  }

  @bind
  private actionsFormatter(field: string, row: IPolicy): JSX.Element | null {
    const { currentOperator = {} } = this.props;
    if (field === 'actions') {
      return (
        <div>
          {currentOperator['policies.put'] ?
            <Icon icon="pen" onClick={this.onEditPolicy.bind(this, row)} title="Редактировать" idHash={`backuppolicy-pen-${generateIdElement()}`}/>
            :
            null
          }
          {currentOperator['policies.delete'] ?
            <Icon key={row.id} icon="trash" onClick={this.tryDeletePolicy.bind(this, row.id)} title="Удалить" idHash={`backuppolicy-trash-${generateIdElement()}`}/>
            :
            null
          }
        </div>
      );
    }
    return null;
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

export { BackupPolicies };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(BackupPolicies);
