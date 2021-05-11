import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {actions as showResourceActions} from '../../../../features/showResource/redux';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState} from 'shared/types/app';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import {Modal, RemoveModal} from 'shared/view/components';
import {Button, Icon} from 'shared/view/elements';
import {IPolicy, IRule, IRuleGroup} from 'shared/types/policy';
import {actions} from '../../redux';
import {getHeadersConfig} from 'shared/helpers/getConfig';
import {IChoosenEditPolicy, TypesFieldPolicy} from '../../namespace';
import {getDaysFromMask, getHoursFromMask, getStringIds} from 'shared/helpers/formatData';
import {actionsConfig} from '../../configs';
import injectResource from 'shared/helpers/injectResource';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import EditRuleForm from '../components/EditRuleForm';
import AddRuleForm from '../components/AddRuleForm';
import './style.styl';
import SaveModal from "../../../../shared/view/components/SaveModal/index";
import i18next from "i18next";

interface IDispatchProps {
  switchRemoveModal: typeof actions.switchRemoveModal;
  switchModalStatus: typeof actions.switchModalStatus;
  switchAddModal: typeof actions.switchAddModal;
  getGroups: typeof actions.getGroups;
  startEditRule: typeof actions.startEditRule;
  startAddRule: typeof actions.startAddRule;
  changeRuleData: typeof actions.changeRuleData;
  addRuleData: typeof actions.addRuleData;
  startDeleteRule: typeof actions.startDeleteRule;
  acceptDeleteRule: typeof actions.acceptDeleteRule;
  sendRuleData: typeof actions.sendRuleData;
  changeOrderItems: typeof actions.changeOrderItems;
  switchSaveModal: typeof actions.switchSaveModal;
  setPolicyNoneEdit: typeof actions.setPolicyNoneEdit;
  loadCurrentOperator: typeof showResourceActions.loadCurrentOperator;
}

interface IStateProps {
  headers: FilterResourseNS.IHeader[];
  configHeaders: IConfigHeaders;
  choosenPolicyEdit: IChoosenEditPolicy | null;
  showCreateEditModal: boolean;
  showAddModal: boolean;
  isPolicyEdit: boolean;
  showSaveModal: boolean;
  showRemoveModal: boolean;
  userGroups: IRuleGroup[];
  printerGroups: IRuleGroup[];
  currentOperator: any;
}

type Props = IDispatchProps & IStateProps;

function mapState(state: IReduxState): IStateProps {
  const {
    choosenPolicyEdit,
    isPolicyEdit,
    showSaveModal,
    showCreateEditModal,
    userGroups,
    printerGroups,
    showRemoveModal,
    showAddModal
  } = state.policy;

  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'rules'),
    configHeaders: getHeadersConfig('rules', state),
    choosenPolicyEdit,
    showCreateEditModal,
    showAddModal,
    showRemoveModal,
    showSaveModal,
    userGroups,
    printerGroups,
    isPolicyEdit,
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    startEditRule:         injectResource('rules', actions.startEditRule),
    changeRuleData:        injectResource('rules', actions.changeRuleData),
    startDeleteRule:       injectResource('rules', actions.startDeleteRule),
    sendRuleData:          injectResource('rules', actions.sendRuleData),
    addRuleData:           injectResource('rules', actions.addRuleData),
    startAddRule:          injectResource('rules', actions.startAddRule),
    changeOrderItems:      actions.changeOrderItems,
    acceptDeleteRule:      actions.acceptDeleteRule,
    switchRemoveModal:     actions.switchRemoveModal,
    switchModalStatus: actions.switchModalStatus,
    switchAddModal:        actions.switchAddModal,
    switchSaveModal:       actions.switchSaveModal,
    getGroups:             actions.getGroups,
    setPolicyNoneEdit:     actions.setPolicyNoneEdit,
    loadCurrentOperator: showResourceActions.loadCurrentOperator
  }, dispatch);
}

// var startOrder : any = null;
//
// function getOrderOfRules(order : any) : number[] {
//   return order.map((item : any) => {
//     return item.seq;
//   });
// }

class Rules extends React.PureComponent<Props, {}> {

  private b = block('rules');

  public componentWillMount() {
      this.props.setPolicyNoneEdit();
  }

  public render() {
    const b = this.b;
    const { headers,  configHeaders, choosenPolicyEdit, switchModalStatus, showCreateEditModal, showAddModal, switchAddModal, showSaveModal } = this.props;
    const { isPolicyEdit, userGroups, printerGroups, changeRuleData, showRemoveModal, switchRemoveModal, switchSaveModal, addRuleData, /*changeOrderItems */} = this.props;
    const { acceptDeleteRule, currentOperator = {} } = this.props;


    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="rules"
          label={choosenPolicyEdit ? `${i18next.t('Rules.FilterResource')} > ${choosenPolicyEdit.name}` : `${i18next.t('Rules.FilterResource')}`}
        />
        <ShowResource
          onAdd={currentOperator['policies.rules.post'] ? this.onAddRule : null}
          resource="rules"
          headers={headers}
          configs={{
            sort: {
              by: 'name',
              order: 'asc',
            },
          }}
          //@ts-ignore
          actionsFormatter={this.actionsFormatter}
          //@ts-ignore
          headersFormatter={this.fieldFormatter}
          policyId={choosenPolicyEdit ? choosenPolicyEdit.id : 0}
          sortable
          configHeadersTable={configHeaders}
        />
        <div className={b('footer')}>
          <Button
            label="Сохранить"
            type="submit"
            disabled={!isPolicyEdit}
            isPrimary
            onClick={switchSaveModal/*this.onSendRuleData*/}
          />
      </div>
        <Modal
          isOpen={showCreateEditModal}
          title={i18next.t('Rules.settings')}
          onClose={() => {switchModalStatus({status: false, mode: ''})}}
        >
          // @ts-ignore
          <EditRuleForm
            onCancel={() => {switchModalStatus({status: false, mode: ''})}}
            onSave={changeRuleData}
            userGroups={userGroups}
            printerGroups={printerGroups}
          />
        </Modal>
        <Modal
            isOpen={showAddModal}
            title={i18next.t('Rules.newRule')}
            onClose={switchAddModal}
        >
          // @ts-ignore
          <AddRuleForm
              onCancel={switchAddModal}
              onAdd={addRuleData/*changeRuleData*/}
              userGroups={userGroups}
              printerGroups={printerGroups}
          />
        </Modal>
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={i18next.t('Rules.deleted')}
          onClose={switchRemoveModal}
          onRemove={acceptDeleteRule}
        />
        <SaveModal
            isOpen={showSaveModal}
            alertMessage={`${i18next.t('Rules.policy')} ${choosenPolicyEdit ? choosenPolicyEdit.name : 0} ${i18next.t('Rules.change')}`}
            onClose={switchSaveModal}
            onSave={this.onSendRuleData}
        />
      </div>
    );
  }

  @bind
  private async onSendRuleData() {
    await this.props.sendRuleData();
    this.props.switchSaveModal();
  }

  @bind
  private async onEditRule(id: number) {
    const { getGroups, switchModalStatus, startEditRule } = this.props;
    await getGroups();
    //await switchModalStatus();
    await startEditRule(id);
  }

  @bind
  private async onAddRule() {
    const { getGroups, switchAddModal, startAddRule/*startEditRule*/ } = this.props;
    await getGroups();
    await switchAddModal();
    // await startEditRule();
    await startAddRule();
  }

  @bind
  private fieldFormatter(field: TypesFieldPolicy, row: IPolicy): JSX.Element | string | number | boolean {
    if (field === 'userGroups' || field === 'printerGroups') {
      return getStringIds(row[field]);
    }
    if (field === 'hours') {
      return getHoursFromMask(row[field]);
    }
    if (field === 'days') {
      return getDaysFromMask(row[field]);
    }
    if (field === 'action') {
      return actionsConfig[row[field]];
    }
    if (field === 'alert') {
      return row[field] ? 'Да' : 'Нет';
    }
    return row[field];
  }

  @bind
  private onDeleteRule(id: number): void {
    const { startDeleteRule, switchRemoveModal } = this.props;
    startDeleteRule(id);
    switchRemoveModal();
  }

  @bind
  private actionsFormatter(field: string, row: IRule): JSX.Element | null {
    const { currentOperator = {} } = this.props;
    if (field === 'actions') {
      return (
        <div>
          {currentOperator['policies.rules.delete'] ?
              <Icon key={row.id} icon="trash" onClick={this.onDeleteRule.bind(this, row.id)}/>
              :
              null
          }
          {currentOperator['policies.rules.put'] ?
              <Icon icon="pen" onClick={this.onEditRule.bind(this, row.id)}/>
              :
              null
          }
        </div>
      );
    }
    return null;
  }
}

export { Rules };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(Rules);
