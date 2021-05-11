import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {actions} from '../../redux';
import {IReduxState} from 'shared/types/app';
import {Modal} from 'shared/view/components';
import GroupSelect from './../GroupSelect';
import './ShowUserGroups.styl';
import {IGroup} from './../../namespace';
import {Field, reduxForm, WrappedFieldProps} from 'redux-form';
import {ITextInputProps, TextInput} from 'shared/view/elements';
import i18next from "i18next";

interface IStateProps {
  showUserGroupModal: boolean;
  allGroups: IGroup[];
  searchInput: string;
}

interface IOwnProps {
  isMultiEdit?: boolean;
}

interface IDispatchProps {
  onClose: typeof actions.switchGroupModal;
  changeUserGroup: typeof actions.changeGroup;
  acceptUserSingleEditGroups: typeof actions.acceptSingleEditGroups;
  acceptUserMultiEditGroups: typeof actions.acceptMultiEditGroups;
}

function mapStateToProps(state: IReduxState): IStateProps {
  let srchIn = null;
  if(state.form.hasOwnProperty('SearchInput')){
    if(state.form.SearchInput.hasOwnProperty("values")){
      srchIn = state.form.SearchInput.values.search
    }
  }

  return {
    showUserGroupModal: state.editUserGroups.showUserGroupModal,
    allGroups: state.editUserGroups.allGroups,
    searchInput: srchIn
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    onClose: actions.switchGroupModal,
    changeUserGroup: actions.changeGroup,
    acceptUserSingleEditGroups: actions.acceptSingleEditGroups,
    acceptUserMultiEditGroups: actions.acceptMultiEditGroups,
  }, dispatch);
}

const b = block('user-groups');
class ShowUserGroupsWin extends React.PureComponent<IStateProps&IDispatchProps&IOwnProps, {} > {
  public render() {
    const {
      showUserGroupModal,
      allGroups,
      changeUserGroup,
      acceptUserSingleEditGroups,
      acceptUserMultiEditGroups,
      isMultiEdit,
      searchInput
    } = this.props;

    const localAllGroups = allGroups.filter((item: any) => {
      return !item.ldapSource || item.isConnected && item.status != "DISABLED"
    })

    return (
      <div className={b()}>
        <Modal
          isOpen={showUserGroupModal}
          title={i18next.t('features.groups')}
          onClose={this.closeEditUserGroupModal}
        >

          <Field
            label={i18next.t('Search.search')}
            name="search"
            component={this._renderField}
            type="text"
          />

          <GroupSelect
            values={localAllGroups}
            onChange={changeUserGroup}
            onClose={this.closeEditUserGroupModal}
            onSave={isMultiEdit ? acceptUserMultiEditGroups : acceptUserSingleEditGroups}
            searchInput={searchInput}
          />
        </Modal>
      </div>
    );
  }

  @bind
  private _renderField(field: WrappedFieldProps<{}>&ITextInputProps) {
    const { touched, error } = field.meta;
    return (
      <TextInput
        {...field.input}
        {...field}
        error={touched && error ? error : false}
      />
    );
  }


  @bind
  private closeEditUserGroupModal() {
    this.props.onClose(false);
  }
}

const ShowUserGroups = reduxForm({ form: 'SearchInput' })(ShowUserGroupsWin);

export { ShowUserGroups };
export default connect<IStateProps, IDispatchProps, IOwnProps >(mapStateToProps, mapDispatchToProps)(ShowUserGroups);
