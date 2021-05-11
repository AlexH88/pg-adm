import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { block } from 'bem-cn';
import { bind } from 'decko';
import { actions } from '../../redux';
import injectResource from 'shared/helpers/injectResource';
import { RemoveModal, Modal } from 'shared/view/components';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import { IReduxState, IResource, IConfigHeaders } from 'shared/types/app';
import { ShowResource } from 'features/showResource';
import { selectors as ShowResourceSelectors, Namespace as ShowResourceNS } from 'features/showResource';
import { getHeadersConfig } from 'shared/helpers/getConfig';
import IntegrationPostForm from './IntegrationPostForm/IntegrationPostForm';
import FilterResource from "../../../../features/filterResource/view/FilterResource/FilterResource";
import Switch from 'react-toolbox/lib/switch';
import {generateIdElement} from 'shared/helpers';
import theme from './theme.styl';
import './Post.styl';

interface IStateProps {
  showModal: boolean;
  configHeaders: IConfigHeaders;
  currentOperator: any;
  successIntegration: boolean;
}

interface IDispatchProps {
  switchModalStatus: typeof actions.switchModalStatus;
  testPostConnection: typeof actions.testPostConnection;
  savePostConnection: typeof actions.createResource;
  getCurrentStatusIntegration: typeof actions.getCurrentStatusIntegration;
  testConnentClear: typeof actions.testConnentClear;
  editIntegration: typeof actions.editResource;
  disableIntegration: typeof actions.disableIntegration;
  enableIntegration: typeof actions.enableIntegration;
}

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  let successIntegration = false;

  if(state.integration.currentStatus.hasOwnProperty('connectionResult')){
      successIntegration = state.integration.currentStatus.connectionResult.success
  }

  return {
    currentOperator: currentOperator.access_rules,
    showModal: state.integration.showModal,
    configHeaders: getHeadersConfig('integration', state),
    successIntegration: successIntegration,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    editIntegration: injectResource('integration', actions.editResource),
    switchModalStatus: actions.switchModalStatus,
    testPostConnection: injectResource('integration', actions.testPostConnection),
    savePostConnection: injectResource('integration', actions.createResource),
    getCurrentStatusIntegration: actions.getCurrentStatusIntegration,
    testConnentClear: injectResource('integration', actions.testConnentClear),
    disableIntegration: injectResource('integration', actions.disableIntegration),
    enableIntegration: injectResource('integration', actions.enableIntegration),
  }, dispatch);
}

const b = block('integration');

class Post extends React.PureComponent<IStateProps & IDispatchProps, {}> {
  componentDidMount() {
    const { getCurrentStatusIntegration } = this.props;
    getCurrentStatusIntegration();
  }

  private static headers = [
    {
      name: 'Имя',
      host: 'Хост',
      port: 'Порт',
      sender: 'Отправитель',
      login: 'Логин'
    },
  ];


  private b = block('roles');

  public render() {
    const b = this.b;
    const { showModal, configHeaders, testPostConnection, testConnentClear } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={Post.headers as any}
          resource="integration"
          label="Интеграция > Почта"
          noDisplaySelect
        />
        <ShowResource
          resource="integration"
          headers={Post.headers as any}
          onAdd={this.openModal}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          //@ts-ignore
          actionsFormatter={this.actionsFormatter}
          configHeadersTable={configHeaders}
          headersFormatter={this.dataFormatter}
        />
        <Modal
          isOpen={showModal}
          title="Настройка интеграции почты"
          onClose={this.closeModal}
        >
          <IntegrationPostForm
            onConnect={() => {testPostConnection(null)}}
            onSave={this.handleSaveForm}
            onCancel={this.closeModal}
            testConnentClear={testConnentClear}
            mode="create"
          />
        </Modal>
      </div>
    );
  }

  @bind
  private dataFormatter(field: any, row: any) {
    const { successIntegration } = this.props;

    if (field === 'enabled') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {successIntegration
            ? <span className={b('circle', { green: true })} id="integration-green"/>
            : <span className={b('circle', { red: true })} id="integration-red"/>
          }
          <span id="integration-switch">
            <Switch
              theme={theme}
              checked={row[field]}
              onChange={() => this.handleToggleIntegration(row.id, row[field])}
              className='switch_integration-switch'
            />
          </span>
        </div>
      );
    }
    return row[field];
  }

  @bind
  private handleToggleIntegration(id: number, status: boolean) {
    const { disableIntegration, enableIntegration, testConnentClear, getCurrentStatusIntegration } = this.props;
    if (status) {
      disableIntegration(id);
      setTimeout( () => {
        getCurrentStatusIntegration();
      }, 800)
    } else {
      enableIntegration(id);
      setTimeout( () => {
        getCurrentStatusIntegration();
        testConnentClear();
      }, 800)
    }
  }

  @bind
  private actionsFormatter(field: string, row: any) {
    const { editIntegration } = this.props;
    if (field === 'actions') {
      return (
        <div>
          {
            <ActionFormatter icon="pen" onClick={editIntegration} id={row.id} mode="edit" title="Редактировать" idHash={`integration-post-pen-${generateIdElement()}`}/>
          }
        </div>
      );
    }
    return null;
  }

  @bind
  private openModal(): void {
    this.props.switchModalStatus({ status: true, mode: 'create' });
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus({ status: false, mode: '' } );
  }

  @bind
  private handleSaveForm() {
    const { savePostConnection, getCurrentStatusIntegration } = this.props;
    savePostConnection();
    setTimeout( () => {
      getCurrentStatusIntegration()
    }, 1000)
  }

};

export { Post };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatchToProps)(Post);
