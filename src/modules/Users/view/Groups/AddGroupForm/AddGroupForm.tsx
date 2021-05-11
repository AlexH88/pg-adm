import * as React from 'react';
import {bindActionCreators} from 'redux';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {connect} from 'react-redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {
    Button,
    Checkbox,
    ICheckboxProps,
    IRadioGroupProps,
    ITextInputProps,
    RadioGroup,
    TextInput
} from 'shared/view/elements';
import Dropdown from 'shared/view/components/StatefulDropdown';
import { validate } from 'shared/helpers/validators/validateGroupCreation';
import ShowResourceActions from 'features/showResource/redux/actions';
import injectResource from 'shared/helpers/injectResource';
import { IMode } from '../../../namespace';
import { IGroup } from 'shared/types/groups';
import './AddGroupForm.styl';
import i18next from "i18next";

interface IOwnProps {
  mode: IMode;
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  users?: any;
  currentGroup?: string;
  type?: string;
  initialValues: any;
}

interface IDispatchProps {
  loadResource: typeof ShowResourceActions.loadResource;
}

const selector = formValueSelector('addUsergroups');

function mapStateToProps(state: IReduxState): IStateProps {
  let users = [];
  let currentGroup = '';
  if(state.hasOwnProperty('showResource')){
    if(state.showResource.hasOwnProperty('users')){
      if(state.showResource.users.hasOwnProperty('data')){
        if(state.showResource.users.data.hasOwnProperty('0')){
          users = state.showResource.users.data['0'];
        }
      }
    }
  }

  if(state.form.hasOwnProperty('addUsergroups')){
    if(state.form.addUsergroups.hasOwnProperty('values')){
      if(state.form.addUsergroups.values.hasOwnProperty('name')){
        currentGroup = state.form.addUsergroups.values.name;
      }
    }
  }

  return {
    users: users,
    currentGroup: currentGroup,
    type: selector(state, 'type') as string,
    initialValues: {
      initialRestricted: false,
    }
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    loadResource: injectResource('users', ShowResourceActions.loadResource),
  }, dispatch);
}

const b = block('add-group');

type IFormProps = FormProps<IGroup, IOwnProps, {}> & IOwnProps & IStateProps & IDispatchProps;

@reduxForm<IGroup, IOwnProps, {}>({
  form: 'addUsergroups',
  validate,
})
class AddGroupForm extends React.PureComponent<IFormProps, {}> {
  componentWillMount() {
    const { loadResource } = this.props;
    loadResource(false, false);
  }

  public render() {
    const { mode, invalid, pristine, error, type } = this.props;
    const isPartial = mode === 'partial-edit';
    const isEdit = mode === 'edit';

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div>
          <Field
            label={i18next.t('AddGroupForm.name')}
            name="name"
            component={this._renderField}
            type="text"
            disabled={isPartial}
          />
        </div>
        <div>
          <Field
            label="Первоначальный взнос*"
            name="initialCredit"
            component={this._renderField}
            type="number"
            step="any"
          />
        </div>
        <div>
          <Field
            label={i18next.t('AddGroupForm.initialRestricted')}
            name="initialRestricted"
            type="checkbox"
            component={this._renderCheckboxField}
          />
        </div>
        <div>
          <Field
            label={i18next.t('AddGroupForm.amount')}
            name="amount"
            component={this._renderField}
            type="number"
            step="any"
          />
        </div>
        <div>
          <Field
            label={i18next.t('AddGroupForm.period')}
            name="period"
            source={[
              { value: 'day', label: `${i18next.t('AddGroupForm.daily')}` },
              { value: 'week', label: `${i18next.t('AddGroupForm.weekly')}` },
              { value: 'month', label: `${i18next.t('AddGroupForm.monthly')}` },
            ]}
            component={this._renderDropdownField}
          />
        </div>
          <Field
            name="accrualType"
            values={[
              { value: 'UPDATE', label: 'Обновление' },
              { value: 'ACCRUAL', label: 'Начисление' },
            ]}
            defaultValue="UPDATE"
            component={this._renderRadioGroupField}
          />

          <Field
            label="Адрес уведомлений"
            name="leaderLogin"
            component={this._renderActionField}
            type="text"
          />

{/*
          <Field
            label="Адрес для уведомлений"
            name="listEmails"
            value={listEmails}
            component={(field: any) => this._renderDropdownEmailsField(field, listEmails)}
          />
*/}
        {/*
          isEdit
          ?
            <Field
              name="type"
              values={[
                { value: 'true', label: `${i18next.t('AddGroupForm.update')}` },
                { value: 'false', label: `${i18next.t('AddGroupForm.accrual')}` },
              ]}
              component={this._renderRadioGroupField}
            />
          :
            null
        */}
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddGroupForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddGroupForm.save')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
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
  private _renderCheckboxField(field: WrappedFieldProps<{}>&ICheckboxProps) {
    return (
      <div className={b('checkbox-wrapper')}>
        <Checkbox
          {...field.input}
          {...field}
        />
      </div>
    );
  }

  @bind
  private _renderDropdownField(field: any /*WrappedFieldProps<{}>&IDropdownProps*/) {
    const { touched, error } = field.meta;

    return (
      <div className={b('dropdown-wrapper')}>
        <Dropdown
          {...field.input}
          {...field}
          error={touched && error ? error : null}
        />
      </div>
    );
  }

  @bind
  private _renderRadioGroupField(field: WrappedFieldProps<{}>&IRadioGroupProps) {

    return (
      <RadioGroup
        {...field.input}
        {...field}
      />
    );
  }

  @bind
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

  @bind
  private normalizeNumberField(value: string): number | undefined {
    return value ? parseInt(value, 10) : undefined;
  }

  @bind
  private _renderActionField(field: any) {
    const { users, currentGroup } = this.props

    let currentUsersForGroup = [];
    users.forEach((item, i) => {
        item.groups.forEach(el => {
          if(el.name == currentGroup){
            currentUsersForGroup.push(item);
            return
          }
        })
    });

    const arrSource = [];
    currentUsersForGroup.forEach((item, i) => {
      let itemObj = {value: '', label: ''};
      itemObj.value = item.login;
      itemObj.label = `${item.login}  ${item.email}`
      arrSource.push(itemObj)
    });

    return (
      <div className={b('dropdown-wrapper')}>
        <Dropdown
          {...field}
          {...field.input}
          source={arrSource}
        />
      </div>
    );
  }

}

export { AddGroupForm };
//export default connect<IStateProps, IOwnProps, IDispatchProps >(mapStateToProps, mapDispatchToProps)(AddGroupForm);
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(AddGroupForm);