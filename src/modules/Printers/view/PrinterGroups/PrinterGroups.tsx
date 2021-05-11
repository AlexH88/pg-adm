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
import {IMode} from '../../namespace';
import {generateIdElement} from 'shared/helpers';
import {Icon} from 'shared/view/elements';
import {Modal, RemoveModal} from 'shared/view/components';
import AddPrinterGroup from 'modules/Printers/view/PrinterGroups/AddPrinterGroup/AddPrinterGroup';
import i18next from "i18next";

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  showModal: boolean;
  showRemoveModal: boolean;
  deletingGroupId: number | string;
  currentOperator: any;
  modalMode: IMode;
}

interface IDispatchProps {
  switchModalStatus: typeof actions.switchModalStatus;
  switchModalStatusMode: typeof actions.switchModalStatusMode;
  switchRemoveModalStatus: typeof actions.switchRemoveModal;
  createPrinterGroup: typeof actions.createPrinterGroup;
  startDeletePrinterGroup: typeof actions.startDeletePrinterGroup;
  deletePrinterGroup: typeof actions.acceptDeleteResource;
  editGroup: typeof actions.editResource;
  editPrinterGroup: typeof actions.saveEditPrinterGroup;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig('printergroups', state),
    cofigAggregates: getAggregates('printergroups', state),
    headers: ShowResourceSelectors.getHeaders(state, 'printergroups'),
    showModal: state.printers.showModal,
    showRemoveModal: state.printers.showRemoveModal,
    deletingGroupId: state.printers.deletingGroupId,
    modalMode: state.printers.modalMode,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchModalStatus: actions.switchModalStatus,
    switchModalStatusMode: actions.switchModalStatusMode,
    switchRemoveModalStatus: actions.switchRemoveModal,
    createPrinterGroup: injectResource('printergroups', actions.createPrinterGroup),
    deletePrinterGroup: injectResource('printergroups', actions.acceptDeleteResource),
    startDeletePrinterGroup: injectResource('printergroups', actions.startDeletePrinterGroup),
    editGroup: injectResource('printergroups', actions.editResource),
    editPrinterGroup: injectResource('printergroups', actions.saveEditPrinterGroup),
  }, dispatch);
}

class PrinterGroups extends React.PureComponent<IStateProps & IDispatchProps, {}> {
  private b = block('printers');

  public render() {
    let { currentOperator = {} } = this.props;
    const b = this.b;
    const { configHeaders, headers, cofigAggregates, showModal, showRemoveModal, switchRemoveModalStatus } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="printergroups"
          label={i18next.t('PrinterGroups.printerGroupHeader')}
          noDisplaySelect
        />
        <ShowResource
          resource="printergroups"
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
          title='Парметры группы'
          onClose={this.closeModal}
        >
          <AddPrinterGroup
            onSave={this.handleSaveForm}
            onCancel={this.closeModal}
          />
        </Modal>

        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={i18next.t('PrinterGroups.willDeleted')}
          onClose={switchRemoveModalStatus}
          onRemove={this.onAcceptDeletePrinterGroup}
        />
      </div>
    );
  }

  @bind
  private openModal() {
    // this.props.switchModalStatus(true);
    this.props.switchModalStatusMode({ status: true, mode: 'create' });
  }

  @bind
  private closeModal() {
    this.props.switchModalStatus(false);
  }

  @bind
  private handleSaveForm() {
    const { modalMode, createPrinterGroup, editPrinterGroup } = this.props;
    if (modalMode === 'create') {
      createPrinterGroup();
    } else {
      editPrinterGroup();
    }
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
  private renderActionsFormatter(field: string, row: IResource) {
    const { currentOperator = {}, editGroup } = this.props;
    if (field === 'actions') { // TODO
      return  (
          <div>
            { currentOperator['printergroups.put'] ?
              <Icon
                key={0}
                icon="pen"
                onClick={editGroup ? editGroup.bind(this, { mode: 'edit', id: row.id }) : null}
                title="Редактировать"
                idHash={`printergroups-pen-${generateIdElement()}`}
              /> : null
            }
            {currentOperator['printergroups.delete'] ?
              <Icon 
                icon="trash" 
                onClick={this.onDelete.bind(this, row.id)}
                title="Удалить"
                idHash={`printergroups-trash-${generateIdElement()}`}
              /> : null
            }
          </div>
      );
    }
    return null;
  }

}
export { PrinterGroups };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(PrinterGroups);
