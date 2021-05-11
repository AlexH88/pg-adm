import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {actions} from '../../redux';
import injectResource from 'shared/helpers/injectResource';
import {Modal} from 'shared/view/components';
import {Tabs} from 'shared/view/components';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {IReduxState, IResource} from 'shared/types/app';
import {ShowResource} from 'features/showResource';
import EditTemplates from './EditTemplates/EditTemplates';
import EditBaseTemplate from './EditBaseTemplate/EditBaseTemplate';
import {IMode} from '../../namespace';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import i18next from "i18next";
import {formatDateTime} from 'shared/helpers/formatData';
import ShowResourceActions from 'features/showResource/redux/actions';
import ItemTooltip from './ItemTooltip/';
import {generateIdElement} from 'shared/helpers';
import './Notifications.styl';

interface IStateProps {
  deletingRole: number;
  showModal: boolean;
  modalMode: IMode;
  currentOperator: any;
  users?: any;
}

interface IDispatchProps {
  switchRemoveModalStatus: typeof actions.switchRemoveModal;
  switchModalStatus: typeof actions.switchModalStatus;
  editTemplate: typeof actions.editTemplatesResource;
  saveTemplate: typeof actions.saveTemplate;
  saveBaseTemplate: typeof actions.saveBaseTemplate;
  loadResource: typeof ShowResourceActions.loadResource;
}

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  let users = [];
  if(state.hasOwnProperty('showResource')){
    if(state.showResource.hasOwnProperty('users')){
      if(state.showResource.users.hasOwnProperty('data')){
        if(state.showResource.users.data.hasOwnProperty('0')){
          users = state.showResource.users.data['0'];
        }
      }
    }
  }

  return {
    currentOperator: currentOperator.access_rules,
    deletingRole: (state.settings.deletingRole as number),
    showModal: state.settings.showModal,
    modalMode: state.settings.modalMode,
    users: users,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchModalStatus: injectResource('templates', actions.switchModalStatus),
    editTemplate: injectResource('templates', actions.editTemplatesResource),
    switchRemoveModalStatus: actions.switchRemoveModal,
    saveTemplate: injectResource('templates', actions.saveTemplate),
    saveBaseTemplate: injectResource('templates', actions.saveBaseTemplate),
    loadResource: injectResource('users', ShowResourceActions.loadResource),
  }, dispatch);
}

const b = block('templates');

class Notifications extends React.PureComponent<IStateProps & IDispatchProps, {}> {
  state = {
    openBaseTemplate: false
  }

  private static headers = [
    {
      isConnected: true,
      isSortable: false,
      title: 'Название уведомления',
      value: 'title',
    },
    {
      isConnected: true,
      isSortable: false,
      title: 'Дата изменеия',
      value: 'modifiedAt',
    },
    {
      isConnected: true,
      isSortable: false,
      title: 'Статус',
      value: 'enabled',
    },
    {
      isConnected: true,
      isSortable: false,
      title: 'Периодичность',
      value: 'periodicity',
    },
    {
      isConnected: true,
      isSortable: false,
      title: 'Получатель',
      value: 'emails',
    },
  ];

  componentWillMount() {
    const { loadResource } = this.props;
    loadResource(false, false);
  }

  public render() {
    const modalStyles = {
      content : {
        width: '970px',
        height: '785px',
        top: '8%',
        position: 'inherit'
      }
    };

    const { showModal, switchRemoveModalStatus, currentOperator = {} } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          //@ts-ignore
          configs={Notifications.headers}
          resource="templates"
          label="Настройки · Администрирование · Уведомления"
          noDisplaySelect
        />
        <ShowResource
          resource="templates"
          headers={Notifications.headers}
          onAdd={null}
          onEditTemplate={currentOperator['users.post'] ? this.openModal : null}
          configs={{
            sort: {
              by: 'title',
              order: 'asc',
            },
          }}
          //@ts-ignore
          actionsFormatter={this.renderActionsFormatter}
          headersFormatter={this.renderDataFormatter}
          configHeadersTable={{ headers: Notifications.headers }}
        />

        <Modal
          isOpen={showModal}
          title={this.state.openBaseTemplate ? "Редактирование основного шаблона" : "Редактирование шаблона"}
          onClose={this.closeModal}
          style={modalStyles}
        >
          {this.state.openBaseTemplate ?
            <EditBaseTemplate
              onCancel={this.closeModal}
              onSave={this.onSaveForm}
            /> :
            <EditTemplates
              onCancel={this.closeModal}
              onSave={this.onSaveForm}
            />
          }
        </Modal>

      </div>
    );
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource) {
    const { currentOperator = {} } = this.props;
    if (field === 'actions') {
      return (
        <div>
          { currentOperator['operators.put'] ?
            <ActionFormatter
              icon="pen"
              onClick={ () => {
                  this.setState({openBaseTemplate: false})
                  this.props.editTemplate(row.tag)
                }
              }
              id={row.tag}
              title="Редактировать"
              idHash={`notifications-pen-${generateIdElement()}`}
            /> : null
          }
        </div>
      );
    }
    return null;
  }

  @bind
  private renderDataFormatter(field: any, row: IResource & any) {
    const { users } = this.props;

    if(field === 'enabled'){
      if(row[field]) {
        return 'Активно'
      } else {
        return 'Не активно'
      }
    }

    if(field === 'modifiedAt' && row[field]) {
      return formatDateTime(row[field])
    }

    if(field === 'periodicity'){
       switch(row[field]){
        case 'HOURLY':
          return 'каждый час'
        case 'WEEKLY':
          return 'еженедельно'
        case 'DAILY':
          return 'ежедневно'
        default:
          return 'по факту'
       }
    }

    if(field === 'emails') {
      if(row.sendToGroup) {
        return 'Руководитель группы'
      }

      if(row[field]){
        let listLoginEmail = [];
        row.emails.forEach(item => {
          users.forEach(el => {
            if(item == el.email){
              listLoginEmail.push(`${el.login}/${el.email}`)
            }
          })
        })

        if(row[field].length == 1){
          return listLoginEmail[0]
        }
        if(row[field].length > 1){
          return(
            <ItemTooltip title="Получатели" items={listLoginEmail} />
          )
        }
      }
    }

    return row[field];
  }

  @bind
  private closeModal(): void {
    this.setState({openBaseTemplate: false})
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  @bind
  private openModal(): void {
    this.setState({openBaseTemplate: true})
    this.props.editTemplate(null)
    this.props.switchModalStatus({ status: true, mode: '' });
  }

  @bind
  private onSaveForm(): void {
    const { saveTemplate, saveBaseTemplate } = this.props;

    if(this.state.openBaseTemplate) {
      saveBaseTemplate()
    } else {
      saveTemplate();
    }
  }

};

export { Notifications };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatchToProps)(Notifications);
