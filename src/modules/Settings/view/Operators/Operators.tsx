import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {actions} from '../../redux';
import injectResource from 'shared/helpers/injectResource';
import {Modal, RemoveModal} from 'shared/view/components';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {IReduxState, IResource} from 'shared/types/app';
import {ShowResource} from 'features/showResource';
import EditOperators from './EditOperators/EditOperators';
import {IMode} from '../../namespace';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import {generateIdElement} from 'shared/helpers';
import i18next from "i18next";

interface IStateProps {
  showRemoveModal: boolean;
  deletingRole: number;
  showModal: boolean;
  modalMode: IMode;
  currentOperator: any;
}

interface IDispatchProps {
  switchRemoveModalStatus: typeof actions.switchRemoveModal;
  startDeleteRole: typeof actions.startDeleteRole;
  deleteRole: typeof actions.acceptDeleteRole;
  switchModalStatus: typeof actions.switchModalStatus;
  editOperator: typeof actions.editOperatorsResource;
  createOperatorsResourse: typeof actions.createOperatorsResourse;
  saveChangesOperatorsResource: typeof actions.saveChangesOperatorsResource;
  downloadReport: typeof actions.downloadReport;
}

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    showRemoveModal: state.settings.showRemoveModal,
    deletingRole: (state.settings.deletingRole as number),
    showModal: state.settings.showModal,
    modalMode: state.settings.modalMode
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    startDeleteRole: injectResource('operators', actions.startDeleteRole),
    deleteRole: injectResource('operators', actions.acceptDeleteRole),
    switchModalStatus: injectResource('operators', actions.switchModalStatus),
    editOperator: injectResource('operators', actions.editOperatorsResource),
    createOperatorsResourse: injectResource('operators', actions.createOperatorsResourse),
    saveChangesOperatorsResource: injectResource('operators', actions.saveChangesOperatorsResource),
    switchRemoveModalStatus: actions.switchRemoveModal,
    downloadReport: injectResource('operators', actions.downloadReport),
  }, dispatch);
}

class Operators extends React.PureComponent<IStateProps & IDispatchProps, {}> {
  private static headers = [
    {
      isConnected: true,
      isSortable: false,
      title: i18next.t('SOperators.login'),
      value: 'login',
    },
    {
      isConnected: true,
      isSortable: false,
      title: i18next.t('SOperators.email'),
      value: 'email',
    },
    {
      isConnected: true,
      isSortable: false,
      title: i18next.t('SOperators.role'),
      value: 'role',
    },
  ];

  private b = block('roles');

  public render() {
    const b = this.b;
    const { showModal, showRemoveModal, switchRemoveModalStatus, currentOperator = {} } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          //@ts-ignore
          configs={Operators.headers}
          resource="operators"
          label={i18next.t('SOperators.header')}
          noDisplaySelect
        />
        <ShowResource
          resource="operators"
          headers={Operators.headers}
          onAdd={currentOperator['operators.post'] ? this.openModal : null}
          configs={{
            sort: {
              by: 'name',
              order: 'asc',
            },
          }}
          //@ts-ignore
          actionsFormatter={this.renderActionsFormatter}
          headersFormatter={this.renderDataFormatter}
          configHeadersTable={{ headers: Operators.headers }}
        />

        <Modal
          isOpen={showModal}
          title={i18next.t('SOperators.settingOperator')}
          onClose={this.closeModal}
        >
          <EditOperators
            onCancel={this.closeModal}
            onSave={this.onSaveForm}
          />
        </Modal>

        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={i18next.t('SOperators.deleted')}
          onClose={switchRemoveModalStatus}
          onRemove={this.onAcceptDeletePrinterGroup}
        />
      </div>
    );
  }

  @bind
  private onAcceptDeletePrinterGroup() {
    const { deleteRole, deletingRole } = this.props;
    deleteRole(deletingRole);
  }

  @bind
  private onDelete(id: number) {
    const { startDeleteRole, switchRemoveModalStatus } = this.props;
    startDeleteRole(id);
    switchRemoveModalStatus();
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource) {
    const { currentOperator = {} } = this.props;
    if (field === 'actions') {
      return (
        <div>
          { currentOperator['operators.put'] ?
            <ActionFormatter icon="pen" onClick={this.props.editOperator} id={row.id} title="Редактировать" idHash={`operators-pen-${generateIdElement()}`}/> : null
          }
          { currentOperator['operators.delete'] ?
            row.login == 'admin'
              ? <ActionFormatter icon="trash_off" onClick={this.onDelete} id={row.id}/>
              : <ActionFormatter icon="trash" onClick={this.onDelete} id={row.id} title="Удалить" idHash={`operators-trash-${generateIdElement()}`}/>
            : null
          }
        </div>
      );
    }
    return null;
  }

  @bind
  private renderDataFormatter(field: any, row: IResource & any) {
    const {
      role
    } = row;

    if (field === 'role') {
      if (role) {
        return `${role.name}`;
      } else {
        return `role deleted`;
      }
    }
    return row[field];
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  @bind
  private openModal(): void {
    this.props.switchModalStatus({ status: true, mode: 'create' });
  }

  @bind
  private onSaveForm(): void {
    const { modalMode, createOperatorsResourse, saveChangesOperatorsResource } = this.props;
    if (modalMode === 'create') {
      createOperatorsResourse();
    } else if (modalMode === 'edit') {
      saveChangesOperatorsResource();
    }
  }

};

export { Operators };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatchToProps)(Operators);
