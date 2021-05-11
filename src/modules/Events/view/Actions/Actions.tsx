import * as React from 'react';
import {bindActionCreators} from 'redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState} from 'shared/types/app';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
// import ShowUserGroups from 'features/editGroups/view/ShowUserGroups/ShowUserGroups';
// import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
// import * as editUserGroups from 'features/editGroups';
// import AddUserForm from './AddUserForm/AddUserForm';
import {IUser} from 'shared/types/users';
// import injectResource from 'shared/helpers/injectResource';
// import { Modal, RemoveModal } from 'shared/view/components';
// import { Icon, Checkbox } from 'shared/view/elements';
import {IAgregate, IMode} from '../../namespace';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import './Actions.styl';
// import * as checkBoxStyke from './checkBoxStyle.styl';
import {selectIsAllSelected} from 'modules/Users/redux/actions/selectors';

interface IDispatchProps {

}

interface IStateProps {
  showModal: boolean;
  showRemoveModal: boolean;
  isMultiEdit: boolean;
  isAllSelected: boolean;
  deleteUserLogin?: IUser;
  modalMode: IMode;
  headers: FilterResourseNS.IHeader[];
  selectedUsers: IUser[];
  configHeaders: IConfigHeaders;
  cofigAggregates: IAgregate[];
  currentOperator: any;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const showResourceState = state.showResource.users;
  // const allUsers = showResourceState ? (showResourceState.data as IUser[][]).reduce<IUser[]>(
  //   (prev, cur) => prev.concat(cur) , [],
  // ) : [];
  const allUsers = showResourceState ? Object.values(showResourceState.data).reduce((prev: IUser[], cur: IUser[]) => {
    return prev.concat(cur);
  }, []) : [];

  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    showModal: state.users.showModal,
    modalMode: state.users.modalMode,
    isMultiEdit: state.users.isMultiEdit,
    isAllSelected: selectIsAllSelected(state, allUsers),
    showRemoveModal: state.users.showRemoveModal,
    deleteUserLogin: (state.users.deleteResourceField as IUser),
    selectedUsers: state.users.selectedUsers,
    headers: ShowResourceSelectors.getHeaders(state, 'action_events'),
    configHeaders: getHeadersConfig('action_events', state),
    cofigAggregates: getAggregates('action_events', state),
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({

  }, dispatch);
}

const drawZero = (date: number) => (
  date > 9 ? `${date}` : `0${date}`
);

class Actions extends React.PureComponent<IDispatchProps&IStateProps, {}> {

  private b = block('actions');
  public render() {
    const {  headers, /* onAllItemsSelect,*/          /*onAllItemsSelect={onAllItemsSelect}*/
      /*acceptDelete,*/ configHeaders, cofigAggregates, /*deleteUserLogin,*/ isAllSelected } = this.props;
    // const actions = this.getHeaderActions();
    return (
      <div className={this.b()}>
        <FilterResource configs={configHeaders} resource="action_events" label="События > Действия оператора"/>
        <ShowResource
          resource="action_events"
          headers={headers}
          configs={{}}
          aggregateStats={cofigAggregates}
          isAllSelected={isAllSelected}
          configHeadersTable={configHeaders}
          headersFormatter={this.renderFormatter}
        />
      </div>
    );
  }

  @bind
  private renderFormatter(field: string, row: any) {

    if (field === 'event_time') {
      const date = new Date(row.event_time*1000);
      return `${drawZero(date.getHours())}:${drawZero(date.getMinutes())}:${drawZero(date.getSeconds())} ` +
        `${drawZero(date.getDate())}.${drawZero(date.getMonth()+1)}.${date.getFullYear()}`;
    }
    return row[field];
  }

}

export { Actions };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Actions);