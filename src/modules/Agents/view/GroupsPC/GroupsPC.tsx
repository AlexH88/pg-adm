import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {actions} from '../../redux';
import {block} from 'bem-cn';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import injectResource from 'shared/helpers/injectResource';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {IAgregate} from 'modules/Users/namespace';
import {Icon} from 'shared/view/elements';
import {Modal, RemoveModal} from 'shared/view/components';
import AddHostGroup from './AddHostGroup/AddHostGroup';
import EditHostGroup from './EditHostGroup/EditHostGroup';
import {generateIdElement} from 'shared/helpers';
import i18next from "i18next";

const resource = 'hostgroups';

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  showModal: boolean;
  showRemoveModal: boolean;
  showHostGroupEditModal: boolean;
  deletingGroupId: number | string;
  currentOperator: any;
}

interface IDispatchProps {
  switchModalStatus: typeof actions.switchModalStatus;
  switchRemoveModalStatus: typeof actions.switchRemoveModal;
  createPrinterGroup: typeof actions.createPrinterGroup;
  startDeletePrinterGroup: typeof actions.startDeletePrinterGroup;
  deletePrinterGroup: typeof actions.acceptDeleteResource;
  switchHostGroupEditModal: typeof actions.switchHostGroupEditModal;
  startEditHostGroup: typeof actions.startEditHostGroup;
  saveEditHostGroup: typeof actions.saveEditHostGroup;
  forceRestart: typeof actions.forceRestart;
  forceActivate: typeof actions.forceActivate;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig(resource, state),
    cofigAggregates: getAggregates(resource, state),
    headers: ShowResourceSelectors.getHeaders(state, resource),
    showModal: state.agents.showModal,
    showRemoveModal: state.agents.showRemoveModal,
    showHostGroupEditModal: state.agents.showHostGroupEditModal,
    deletingGroupId: state.agents.deletingGroupId,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchModalStatus: actions.switchModalStatus,
    switchRemoveModalStatus: actions.switchRemoveModal,
    switchHostGroupEditModal: actions.switchHostGroupEditModal,
    startEditHostGroup: actions.startEditHostGroup,
    saveEditHostGroup: actions.saveEditHostGroup,
    forceRestart: actions.forceRestart,
    forceActivate: actions.forceActivate,
    createPrinterGroup: injectResource(resource, actions.createPrinterGroup),
    deletePrinterGroup: injectResource(resource, actions.acceptDeleteResource),
    startDeletePrinterGroup: injectResource(resource, actions.startDeletePrinterGroup),
  }, dispatch);
}

class GroupsPC extends React.PureComponent<IStateProps & IDispatchProps, {}> {
  private b = block('printers');

  public render() {
    let { currentOperator = {}, showHostGroupEditModal } = this.props;
    const b = this.b;
    const {
      configHeaders,
      headers,
      cofigAggregates,
      showModal,
      showRemoveModal,
      switchRemoveModalStatus,
      switchHostGroupEditModal,
      saveEditHostGroup,
      createPrinterGroup,
      forceRestart,
      forceActivate
    } = this.props;
    
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource={resource}
          label={i18next.t('GroupsPC.groupsPCHeader')}
          noDisplaySelect
        />
        <ShowResource
          resource={resource}
          headers={headers}
          onAdd={currentOperator['printergroups.post'] ? this.openModal : null}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          aggregateStats={cofigAggregates}
          //@ts-ignore
          actionsFormatter={this.renderActionsFormatter}
          configHeadersTable={configHeaders}
        />

        <Modal
          isOpen={showModal}
          title={i18next.t('GroupsPC.addGropu')}
          onClose={this.closeModal}
        >
          <AddHostGroup
            onSave={createPrinterGroup}
            onCancel={this.closeModal}
          />
        </Modal>

        <Modal
          isOpen={showHostGroupEditModal}
          title={i18next.t('GroupsPC.groupProperties')}
          onClose={switchHostGroupEditModal}
        >
          <EditHostGroup
            onSave={saveEditHostGroup}
            onCancel={switchHostGroupEditModal}
            onRestartAgent={forceRestart}
            onActivate={forceActivate}
          />
        </Modal>

        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={i18next.t('GroupsPC.deletedGropu')}
          onClose={switchRemoveModalStatus}
          onRemove={this.onAcceptDeletePrinterGroup}
        />
      </div>
    );
  }

  @bind
  private openModal() {
    this.props.switchModalStatus(true);
  }

  @bind
  private closeModal() {
    this.props.switchModalStatus(false);
  }

  @bind
  private onAcceptDeletePrinterGroup() {
    const { deletePrinterGroup, deletingGroupId } = this.props;
    deletePrinterGroup(deletingGroupId);
  }

  @bind
  private onDelete(id: number) {
    const { startDeletePrinterGroup, switchRemoveModalStatus } = this.props;
    startDeletePrinterGroup(id);
    switchRemoveModalStatus();
  }

  @bind
  private onStartEditHostGroup(rowData: any) {
    const { startEditHostGroup } = this.props;
    startEditHostGroup(rowData);
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource) {
    const { currentOperator = {} } = this.props;
    if (field === 'actions') { // TODO
      return  currentOperator['printergroups.delete'] ?
      (
        <div>
          <Icon key={0} icon="pen" onClick={this.onStartEditHostGroup.bind(this, row)} title="Редактировать" idHash={`grouppc-pen-${generateIdElement()}`}/>
          <Icon key={1} icon="trash" onClick={this.onDelete.bind(this, row.id)} title="Удалить" idHash={`grouppc-trash-${generateIdElement()}`}/>
        </div>
      ) : null;
    }
    return null;
  }

}
export { GroupsPC };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(GroupsPC);
