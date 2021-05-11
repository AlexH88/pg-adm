import * as React from 'react';
import {block} from 'bem-cn';

import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {push} from 'connected-react-router'
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
import {getPolicyById} from 'shared/helpers/formatData';
import injectResource from 'shared/helpers/injectResource';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import AddPolicyForm from '../components/AddPolicyForm';
import {CreateMarkForm} from './dialogs/CreateMarkForm';
import i18next from "i18next";
import './style.styl';
import DecryptForm from '../components/DecryptForm/index';

interface IDispatchProps {
  activatePolicy: typeof actions.activateResource;
  deactivatePolicy: typeof actions.deactivateResource;
  deletePolicy: typeof actions.deleteResource;
  acceptDelete: typeof actions.acceptDelete;
  switchRemoveModal: typeof actions.switchRemoveModal;
  loadTextData: typeof actions.loadTextData;
  switchModalStatus: typeof actions.switchModalStatus;
  createPolicy: typeof actions.createResource;
  setMarkPolicyEdit: typeof actions.setMarkPolicyEdit;
  switchConfirmModal: typeof actions.switchConfirmModal;
  switchMarkModal: typeof actions.switchMarkModal;
  switchDecryptModal: typeof actions.switchDecryptModal;
  decrypt: typeof actions.decrypt;
  loadCurrentOperator: typeof showResourceActions.loadCurrentOperator;
  getGroups: typeof actions.getGroups;
  setDecryptMessage: typeof actions.setDecryptMessage;
  historyPush: typeof push;
}

interface IStateProps {
  headers: FilterResourseNS.IHeader[];
  configHeaders: IConfigHeaders;
  configAggregates: IAgregate[];
  showRemoveModal: boolean;
  showCreateEditModal: boolean;
  showMarkModal: boolean;
  showConfirmModal: boolean;
  policiesData: IPolicy[][];
  choosenPolicyEdit: IChoosenEditPolicy | null;
  currentOperator: any;
  userGroups: any[];
  printerGroups: any[];
  showDecryptModal: boolean;
  decryptMessage: string;
}

interface ILocation {
  location: any;
}

// type TypesFieldPolicy = 'name' | 'state' | 'owner' | 'description' | 'id' | 'state';

type Props = IDispatchProps & IStateProps & ILocation;

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'label_policies'),
    configHeaders: getHeadersConfig('label_policies', state),
    configAggregates: getAggregates('label_policies', state),
    showRemoveModal: state.policy.showRemoveModal,
    showCreateEditModal: state.policy.showCreateEditModal,
    showConfirmModal: state.policy.showConfirmModal,
    showMarkModal: state.policy.showMarkModal,
    choosenPolicyEdit: state.policy.choosenPolicyEdit,
    userGroups: state.policy.userGroups,
    printerGroups: state.policy.printerGroups,
    showDecryptModal: state.policy.showDecryptModal,
    decryptMessage: state.policy.decryptMessage,
    policiesData: selectors.getPoliciesData(state)
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    activatePolicy: injectResource('label_policies', actions.activateResource),
    deactivatePolicy: injectResource('label_policies', actions.deactivateResource),
    deletePolicy: injectResource('label_policies', actions.deleteResource),
    createPolicy:  injectResource('label_policies', actions.createResource),
    switchRemoveModal: actions.switchRemoveModal,
    switchModalStatus: actions.switchModalStatus,
    acceptDelete: actions.acceptDelete,
    setMarkPolicyEdit: actions.setMarkPolicyEdit,
    switchConfirmModal: actions.switchConfirmModal,
    switchMarkModal: actions.switchMarkModal,
    loadCurrentOperator: showResourceActions.loadCurrentOperator,
    loadTextData: actions.loadTextData,
    switchDecryptModal: actions.switchDecryptModal,
    decrypt: actions.decrypt,
    getGroups: injectResource('label_policies', actions.getGroups),
    setDecryptMessage: actions.setDecryptMessage,
    historyPush: push
  }, dispatch);
}

const b = block('policies');

class MarkPolicies extends React.PureComponent<Props, {}> {

  public componentDidMount() {
    const { policiesData, choosenPolicyEdit, loadTextData, getGroups } = this.props;
    const policy = policiesData && choosenPolicyEdit ? getPolicyById(policiesData, choosenPolicyEdit.id) : {};
    if (this.checkRedirectAndActivePolicy(policy as IPolicy)) {
      this.props.switchConfirmModal();
    }
    getGroups();
    loadTextData();
  }

  public render() {
    const { headers, configHeaders, configAggregates, acceptDelete, showRemoveModal, switchRemoveModal, showMarkModal,
      showDecryptModal, decryptMessage } = this.props;
    const { switchModalStatus, showCreateEditModal, switchConfirmModal, switchMarkModal } = this.props;
    const { showConfirmModal, decrypt, switchDecryptModal, historyPush } = this.props;
    return (
        <div className={b()}>
          <FilterResource
            configs={configHeaders}
            resource="label_policies"
            label={i18next.t('MarkPolicies.header')}
          />
          <div style={{float: 'right', marginTop: '10px', position: 'relative', zIndex: 10}}>
            <span className={block('btn-sm')()} onClick={()=>{historyPush('/policies/text-marks')}}
              title={i18next.t('MarkPolicies.tags')}>{i18next.t('MarkPolicies.tags')}</span>
          </div>
          <div style={{float: 'right', marginTop: '10px', marginRight: '10px', position: 'relative', zIndex: 10}}>
            <span className={block('btn-sm')()} onClick={switchDecryptModal} title={i18next.t('MarkPolicies.tags')}>{i18next.t('MarkPolicies.decrypt')}</span>
          </div>
          <ShowResource
            onAdd={this.onEditMarkPolicy.bind(this, null, null)}
            resource="label_policies"
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
            isOpen={showMarkModal}
            title={i18next.t('MarkPolicies.policySettings')}
            onClose={switchMarkModal}
          >
            <CreateMarkForm
              onCancel={switchMarkModal}
            />
          </Modal>
          <Modal
            isOpen={showCreateEditModal}
            title={i18next.t('MarkPolicies.policySettings')}
            onClose={() => {switchModalStatus({status: false, mode: ''})}}
          >
            <AddPolicyForm
              onCancel={() => {switchModalStatus({status: false, mode: ''})}}
              onSave={this.onCreateMarkPolicy}
            />
          </Modal>
          <Modal
            isOpen={showDecryptModal}
            title={i18next.t('MarkPolicies.decryption')}
            onClose={this.switchDecryptModal}
          >
            <DecryptForm
              onCancel={this.switchDecryptModal}
              onSave={decrypt}
              message={decryptMessage}
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
            title={i18next.t('MarkPolicies.activate')}
            onClose={switchConfirmModal}
            onConfirm={this.onConfirmActivatePolicy}
          />
        </div>
    );
  }

  @bind
  switchDecryptModal() {
    const { setDecryptMessage, switchDecryptModal } = this.props;
    switchDecryptModal();
    setDecryptMessage('');
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
    const { userGroups, printerGroups } = this.props;

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

    if (field === 'owner') {
      return row[field] ? (row[field] as any).login : null;
    }

    if (field === 'usergroups') {
      const users = row[field] ? row[field] : [];
      return userGroups.filter(item => users.indexOf(item.id) !== -1 ).map(item => item.name).join(', ');
    }

    if (field === 'printergroups') {
      const printers = row[field] ? row[field] : [];
      return printerGroups.filter(item => printers.indexOf(item.id) !== -1 ).map(item => item.name).join(', ');
    }

    return row[field];
  }

  @bind
  private actionsFormatter(field: string, row: IPolicy): JSX.Element | null {
    const { currentOperator = {} } = this.props;

    if (field === 'actions') {
      return (
        <div>
          {currentOperator['policies.delete'] ?
              <Icon key={row.id} icon="trash" onClick={this.tryDeletePolicy.bind(this, row.id)}/>
              :
              null
          }
          {currentOperator['policies.put'] ?
              <Icon icon="pen" onClick={this.onEditMarkPolicy.bind(this, row)}/>
              :
              null
          }
        </div>
      );
    }

    return null;
  }

  @bind
  private async onCreateMarkPolicy() {
    const { createPolicy, setMarkPolicyEdit } = this.props;

    const rowsLength = document.querySelectorAll('.data-table__row').length;
    if (!1) console.log(rowsLength);
    await createPolicy();
    setMarkPolicyEdit(null);
  }

  @bind
  private onEditMarkPolicy(markPolicy: any) {
    const { setMarkPolicyEdit } = this.props;
    setMarkPolicyEdit(markPolicy);
  }

  @bind
  private tryDeletePolicy(id: number) {
    const { switchRemoveModal, deletePolicy } = this.props;
    switchRemoveModal();
    deletePolicy(id);
  }

}

export { MarkPolicies };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(MarkPolicies);
