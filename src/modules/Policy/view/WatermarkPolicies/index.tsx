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
import AddPolicyForm from '../components/AddPolicyForm';
import WatermarkSettings from '../WatermarkSettings';
import i18next from "i18next";
import {ToastSuccess} from 'shared/view/components';
import {generateIdElement} from 'shared/helpers';
import './style.styl';

interface IDispatchProps {
  activatePolicy: typeof actions.activateResource;
  deactivatePolicy: typeof actions.deactivateResource;
  deletePolicy: typeof actions.deleteResource;
  acceptDelete: typeof actions.acceptDelete;
  switchRemoveModal: typeof actions.switchRemoveModal;
  switchWatermarksModal: typeof actions.switchWatermarksModal;
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
  showWatermarksSettingsModal: boolean;
  showConfirmModal: boolean;
  policiesData: IPolicy[][];
  choosenPolicyEdit: IChoosenEditPolicy | null;
  currentOperator: any;
  userGroups: any[];
  printerGroups: any[];
  hostGroups: any[];
  modalMode: IMode;
  addWaterMark: any;
}

interface ILocation {
  location: any;
}

type Props = IDispatchProps & IStateProps & ILocation;

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'watermark_policy'),
    configHeaders: getHeadersConfig('watermark_policy', state),
    configAggregates: getAggregates('watermark_policy', state),
    showRemoveModal: state.policy.showRemoveModal,
    showCreateEditModal: state.policy.showCreateEditModal,
    showWatermarksSettingsModal: state.policy.showWatermarksSettingsModal,
    showConfirmModal: state.policy.showConfirmModal,
    choosenPolicyEdit: state.policy.choosenPolicyEdit,
    policiesData: selectors.getPoliciesData(state),
    userGroups: state.policy.userGroups,
    printerGroups: state.policy.printerGroups,
    hostGroups: state.policy.hostGroups,
    modalMode: state.policy.modalMode,
    addWaterMark: state.policy.addWaterMark,
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    activatePolicy: injectResource('watermark_policy', actions.activateResource),
    deactivatePolicy: injectResource('watermark_policy', actions.deactivateResource),
    deletePolicy: injectResource('watermark_policy', actions.deleteResource),
    createPolicy:  injectResource('watermark_policy', actions.createResource),
    savePolicy: injectResource('watermark_policy', actions.saveResource),
    switchRemoveModal: actions.switchRemoveModal,
    switchWatermarksModal: actions.switchWatermarksModal,
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

class WatermarkPolicies extends React.PureComponent<Props, {}> {
  state = {
    editedWatermarkPolicy: null
  }

  public componentDidMount() {
    const { policiesData, choosenPolicyEdit } = this.props;
    //const policy = policiesData && choosenPolicyEdit ? getPolicyById(policiesData, choosenPolicyEdit.id) : {};
    //if (this.checkRedirectAndActivePolicy(policy as IPolicy)) {
    //  this.props.switchConfirmModal();
    //}
    this.props.getGroups();
  }

  public render() {
    const {
      headers,
      configHeaders,
      configAggregates,
      acceptDelete,
      showRemoveModal,
      switchRemoveModal,
      switchWatermarksModal,
      switchModalStatus,
      showCreateEditModal,
      showWatermarksSettingsModal,
      switchConfirmModal,
      currentOperator = {},
      showConfirmModal,
      addWaterMark
    } = this.props;

    return (
        <div className={b()}>
          <FilterResource
            configs={configHeaders}
            resource="watermark_policy"
            label={i18next.t('PolicyLk.labelHeader')}
          />
          <ShowResource
            onAdd={currentOperator['policies.post'] ?  () => {switchModalStatus({ status: true, mode: 'create' })} : null}
            resource="watermark_policy"
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
            title={i18next.t('PolicyLk.watermarkPolicySettings')}
            onClose={() => {switchModalStatus({status: false, mode: ''})}}
          >
            <AddPolicyForm
              onCancel={() => {switchModalStatus({status: false, mode: ''})}}
              onSave={this.onSaveForm}
              policyType="watermark"
            />
          </Modal>
          <Modal
            isOpen={showWatermarksSettingsModal}
            title={i18next.t('PolicyLk.watermarkSettings')}
            onClose={switchWatermarksModal}
          >
            <WatermarkSettings
              onClose={() => {
                this.setState({ editedWatermarkPolicy: null });
                switchWatermarksModal();
              }}
              editedWatermarkPolicy={this.state.editedWatermarkPolicy}
            />
          </Modal>
          <RemoveModal
            isOpen={showRemoveModal}
            alertMessage={i18next.t('PolicyLk.policyDeleted')}
            onClose={switchRemoveModal}
            onRemove={acceptDelete}
          />
          <ConfirmationModal
            isOpen={showConfirmModal}
            alertMessage=""
            title={i18next.t('PolicyLk.activatePolicy')}
            onClose={switchConfirmModal}
            onConfirm={this.onConfirmActivatePolicy}
          />
          {
            addWaterMark
              ?
              <ToastSuccess
                status={addWaterMark ? addWaterMark.status : false}
                title=""
                text={addWaterMark ? addWaterMark.text : ''}
              />
              :
              null
          }

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {currentOperator['policies.put'] ?
            <Icon icon="pen" onClick={this.onEditPolicy.bind(this, row)} title="Редактировать" idHash={`watermarkspolicy-pen-${generateIdElement()}`}/>
            :
            null
          }
          {currentOperator['policies.put'] ?
            <Icon icon="watermarks" onClick={this.onEditWatermarks.bind(this, row)} title="Настроить" idHash={`watermarkspolicy-watermarks-${generateIdElement()}`}/>
            :
            null
          }
          {currentOperator['policies.delete'] ?
            <Icon key={row.id} icon="trash" onClick={this.tryDeletePolicy.bind(this, row.id)} title="Удалить" idHash={`watermarkspolicy-trash-${generateIdElement()}`}/>
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
  private onEditWatermarks(rowData: any) {
    const { switchWatermarksModal } = this.props;
    this.setState({ editedWatermarkPolicy: rowData.id });
    switchWatermarksModal();
  }

  @bind
  private tryDeletePolicy(id: number) {
    const { switchRemoveModal, deletePolicy } = this.props;
    switchRemoveModal();
    deletePolicy(id);
  }

}

export { WatermarkPolicies };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(WatermarkPolicies);
