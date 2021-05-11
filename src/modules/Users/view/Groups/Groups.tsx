import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import {IGroup} from 'shared/types/groups';
import AddGroupForm from './AddGroupForm/AddGroupForm';
import injectResource from 'shared/helpers/injectResource';
import {Modal, RemoveModal} from 'shared/view/components';
import {actions} from '../../redux';
import {IAgregate, IGroupHeaderConfigs, IMode} from '../../namespace';
import {headerGroupConfigs} from '../../configs';
import './Groups.styl';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {generateIdElement} from 'shared/helpers';
import Icon from "../../../../shared/view/elements/Icon/index";
import i18next from "i18next";

interface IDispatchProps {
  createGroup: typeof actions.createResource;
  editGroup: typeof actions.editResource;
  saveEditGroup: typeof actions.saveEditResource;
  deleteGroup: typeof actions.deleteResource;
  switchModalStatus: typeof actions.switchModalStatus;
  acceptDelete: typeof actions.acceptDelete;
  switchRemoveModalStatus: typeof actions.switchRemoveModalStatus;
}

interface IStateProps {
  showModal: boolean;
  modalMode: IMode;
  showRemoveModal: boolean;
  headers: FilterResourseNS.IHeader[];
  configHeaders: IConfigHeaders;
  configAggregates: IAgregate[];
  deleteGroupName?: IGroup;
  currentOperator: any;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    showModal: state.users.showModal,
    modalMode: state.users.modalMode,
    showRemoveModal: state.users.showRemoveModal,
    deleteGroupName: (state.users.deleteResourceField as IGroup),
    headers: ShowResourceSelectors.getHeaders(state, 'usergroups'),
    configHeaders: getHeadersConfig('usergroups', state),
    configAggregates: getAggregates('usergroups', state),
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    createGroup: injectResource('usergroups', actions.createResource),
    editGroup: injectResource('usergroups', actions.editResource),
    deleteGroup: injectResource('usergroups', actions.deleteResource),
    saveEditGroup: injectResource('usergroups', actions.saveEditResource),
    switchModalStatus: actions.switchModalStatus,
    switchRemoveModalStatus: actions.switchRemoveModalStatus,
    acceptDelete: actions.acceptDelete,
  }, dispatch);
}

class Groups extends React.PureComponent<IDispatchProps&IStateProps, {}> {
  private b = block('usergroups');

  public render() {
    const b = this.b;
    const { showRemoveModal, deleteGroupName, headers } = this.props;
    let { acceptDelete, showModal, modalMode, configHeaders, configAggregates, currentOperator } = this.props;
    currentOperator = currentOperator || {};
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="usergroups"
          label={i18next.t('Groups.groupsHeader')}
        />
        <ShowResource
          onAdd={currentOperator['usergroups.post'] ? this.openModal : null}
          resource="usergroups"
          headers={headers}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          //@ts-ignore
          headersFormatter={this.dataFormatter}
          //@ts-ignore
          actionsFormatter={this.actionsFormatter}
          aggregateStats={configAggregates}
          configHeadersTable={configHeaders}
        />
        <Modal
          isOpen={showModal}
          title={i18next.t('Groups.settings')}
          onClose={this.closeModal}
        >
          <AddGroupForm
            onCancel={this.closeModal}
            onSave={this.handleSaveForm}
            mode={modalMode}
          />
        </Modal>
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={`${i18next.t('Groups.group')} "${deleteGroupName ? deleteGroupName.name : ''}" ${i18next.t('Groups.willDeleted')}`}
          onClose={this.closeRemoveModal}
          onRemove={acceptDelete}
        />
      </div>
    );
  }

  @bind
  private openModal() {
    this.props.switchModalStatus({ status: true, mode: 'create' });
  }

  @bind
  private closeModal() {
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  @bind
  private closeRemoveModal(): void {
    this.props.switchRemoveModalStatus(false);
  }

  @bind
  private handleSaveForm() {
    const { modalMode, createGroup, saveEditGroup } = this.props;
    if (modalMode === 'create') {
      createGroup();
    } else {
      saveEditGroup();
    }
  }

  @bind
  private dataFormatter(field: keyof IGroupHeaderConfigs, row: IResource & IGroup) {
    if (headerGroupConfigs[field] && headerGroupConfigs[field][row[field]]) {
      return headerGroupConfigs[field][row[field]];
    }

    if (field === 'initialRestricted') {
      const formatedValue = row.initialRestricted ? `${i18next.t('Groups.Yes')}` : `${i18next.t('Groups.Not')}`;
      return formatedValue;
    }

    if (field === 'type') {
      if(row.accrualType){
        const formatedValue = row.accrualType == 'UPDATE' ? 'Обновление' : 'Начисление';
        return formatedValue;
      } else {
        return null;
      }
    }

    if (field === 'ldapSource') {
      const typeLdapDn = row.ldapSource ? 'LDAP группа' : 'Локальная группа';
      return typeLdapDn;
    }

    return row[field];
  }

  @bind
  private actionsFormatter(field: string, row: IResource & IGroup): JSX.Element | null {
    const { deleteGroup, editGroup, currentOperator } = this.props;
    if (field === 'actions') {
      return (
          <div>
            { currentOperator['usergroups.put'] ?
              <Icon
                key={0}
                icon="pen"
                onClick={editGroup ? editGroup.bind(this, { mode: 'edit', id: row.id }) : null}
                title="Редактировать"
                idHash={`groups-pen-${generateIdElement()}`}
              /> : null
            }

            { currentOperator['usergroups.delete']
                ? !row.ldapSource
                  ? <Icon key={1} icon="trash" onClick={deleteGroup ? deleteGroup.bind(this, row.id) : null} title="Удалить" idHash={`groups-trash-${generateIdElement()}`}/>
                  : <Icon key={1} icon="trash_off" title="Удалить" idHash={`groups-trash-${generateIdElement()}`}/>
                : null
            }
          </div>
      );
    }
    return null;
  }
};

export { Groups };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Groups);
