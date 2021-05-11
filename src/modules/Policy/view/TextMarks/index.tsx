import * as React from 'react';
import {block} from 'bem-cn';

import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState} from 'shared/types/app';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import {Modal, RemoveModal} from 'shared/view/components';
import {IPolicy} from 'shared/types/policy';
import {actions} from '../../redux';
import {actions as showResourceActions} from '../../../../features/showResource/redux';
import {selectors} from '../../redux/actions';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {IAgregate, IChoosenEditPolicy} from '../../namespace';
import {Icon} from 'shared/view/elements';
import {getPolicyById} from 'shared/helpers/formatData';
import {push} from 'connected-react-router'
import injectResource from 'shared/helpers/injectResource';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import AddTextMarkForm from '../components/AddTextMarkForm';
import i18next from "i18next";

import './style.styl';

interface IDispatchProps {
  deletePolicy: typeof actions.deleteResource;
  acceptDelete: typeof actions.acceptDelete;
  switchRemoveModal: typeof actions.switchRemoveModal;
  switchModalStatus: typeof actions.switchModalStatus;
  createTextMark: typeof actions.createResource;
  setEditPolicy: typeof actions.setEditPolicy;
  switchConfirmModal: typeof actions.switchConfirmModal;
  startEditTextMark: typeof actions.startEditTextMark;
  loadCurrentOperator: typeof showResourceActions.loadCurrentOperator;
  historyPush: typeof push;
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
}

interface ILocation {
  location: any;
}

type Props = IDispatchProps & IStateProps & ILocation;

function mapState(state: IReduxState): IStateProps {
  if (!1) console.dir(state);
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'text_labels'),
    configHeaders: getHeadersConfig('text_labels', state),
    configAggregates: getAggregates('text_labels', state),
    showRemoveModal: state.policy.showRemoveModal,
    showCreateEditModal: state.policy.showCreateEditModal,
    showConfirmModal: state.policy.showConfirmModal,
    choosenPolicyEdit: state.policy.choosenPolicyEdit,
    policiesData: selectors.getPoliciesData(state),
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    deletePolicy: injectResource('text_labels', actions.deleteResource),
    createTextMark:  injectResource('text_labels', actions.createResource),
    startEditTextMark:  actions.startEditTextMark,
    switchRemoveModal: actions.switchRemoveModal,
    switchModalStatus: actions.switchModalStatus,
    acceptDelete: actions.acceptDelete,
    setEditPolicy: actions.setEditPolicy,
    switchConfirmModal: actions.switchConfirmModal,
    loadCurrentOperator: showResourceActions.loadCurrentOperator,
    historyPush: push
  }, dispatch);
}

const b = block('policies');

class TextMarks extends React.PureComponent<Props, {}> {

  public componentDidMount() {
    const { policiesData, choosenPolicyEdit } = this.props;
    const policy = policiesData && choosenPolicyEdit ? getPolicyById(policiesData, choosenPolicyEdit.id) : {};
    if (this.checkRedirectAndActivePolicy(policy as IPolicy)) {
      this.props.switchConfirmModal();
    }
  }

  public render() {
    const { headers, configHeaders, configAggregates, acceptDelete, showRemoveModal, switchRemoveModal } = this.props;
    const { switchModalStatus, showCreateEditModal, historyPush } = this.props;
    return (
        <div className={b()}>
          <FilterResource
            configs={configHeaders}
            resource="text_labels"
            label={i18next.t('MarkPolicies.header')}
          />
          <div style={{float: 'left', marginTop: '10px', position: 'relative', zIndex: 10, marginLeft: '40px'}}>
            <span className={block('btn-sm')()} onClick={()=>{historyPush('/policies/mark-policies')}} >{i18next.t('MarkPolicies.back')}</span>
          </div>
          <ShowResource
            onAdd={() => {switchModalStatus({ status: true, mode: 'create'})}}
            resource="text_labels"
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
            headersFormatter={this.headersFormatter}
            configHeadersTable={configHeaders}
          />
          <Modal
            isOpen={showCreateEditModal}
            title={i18next.t('MarkPolicies.tagOptions')}
            onClose={() => {switchModalStatus({status: false, mode: ''})}}
          >
            <AddTextMarkForm
              onCancel={() => {switchModalStatus({status: false, mode: ''})}}
              onSave={this.onCreateTextMark}
            />
          </Modal>
          <RemoveModal
            isOpen={showRemoveModal}
            alertMessage={i18next.t('MarkPolicies.deleted')}
            onClose={switchRemoveModal}
            onRemove={acceptDelete}
          />
        </div>
    );
  }

  @bind
  private checkRedirectAndActivePolicy(policy: IPolicy): boolean {
    return Object.keys(this.props.location.query).length > 0
    && this.props.location.query.tryActivate === 'true'
    && policy && policy.state === false;
  }

  @bind
  private startEditGroup(textMark: any) { // TODO
    const { startEditTextMark } = this.props;
    startEditTextMark(textMark);
  } 

  @bind
  private headersFormatter(field: string, row: any): JSX.Element | string | number | boolean {
    if (field === 'encrypted') {
      return row[field] ? `${i18next.t('MarkPolicies.Yes')}` : `${i18next.t('MarkPolicies.Not')}`;
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
              <Icon icon="pen" onClick={this.startEditGroup.bind(this, row)}/>
              :
              null
          }
          {currentOperator['policies.delete'] ?
              <Icon key={row.id} icon="trash" onClick={this.tryDeletePolicy.bind(this, row.id)}/>
              :
              null
          }
        </div>
      );
    }
    return null;
  }

  @bind
  private async onCreateTextMark() {
    const { createTextMark } = this.props;
    createTextMark();
  }

  @bind
  private tryDeletePolicy(id: number) {
    const { switchRemoveModal, deletePolicy } = this.props;
    switchRemoveModal();
    deletePolicy(id);
  }

}

export { TextMarks };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(TextMarks);
