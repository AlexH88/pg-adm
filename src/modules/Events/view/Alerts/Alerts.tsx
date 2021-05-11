import * as React from 'react';
import {bindActionCreators} from 'redux';
// import { bind } from 'decko';
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
import './Alerts.styl';
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
    headers: ShowResourceSelectors.getHeaders(state, 'alerts'),
    configHeaders: getHeadersConfig('alerts', state),
    cofigAggregates: getAggregates('alerts', state),
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({

  }, dispatch);
}

class Alerts extends React.PureComponent<IDispatchProps&IStateProps, {}> {

  private b = block('alerts');
  public render() {
    const {  headers, /* onAllItemsSelect,*/          /*onAllItemsSelect={onAllItemsSelect}*/
        /*acceptDelete,*/ configHeaders, cofigAggregates, /*deleteUserLogin,*/ isAllSelected } = this.props;
    // const actions = this.getHeaderActions();
    return (
        <div className={this.b()}>
          <FilterResource configs={configHeaders} resource="alerts" label="События > Оповещения"/>
          <ShowResource
              resource="alerts"
              headers={headers}
              configs={{}}
              aggregateStats={cofigAggregates}
              isAllSelected={isAllSelected}
              configHeadersTable={configHeaders}
          />
        </div>
    );
  }

};

export { Alerts };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Alerts);