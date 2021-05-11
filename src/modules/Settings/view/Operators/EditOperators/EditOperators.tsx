import * as React from 'react';
import { connect } from 'react-redux';
import { IReduxState, IOperator } from 'shared/types/app';
import { Field, reduxForm, WrappedFieldProps, FormProps, formValueSelector } from 'redux-form';
import { block } from 'bem-cn';
import { bind } from 'decko';
import { Button, TextInput, ITextInputProps, IDropdownProps } from 'shared/view/elements';
import './EditOperators.styl';
import { validate } from 'shared/helpers/validators/validateOperatorsCreation';
import StatefulDropdown from 'shared/view/components/StatefulDropdown';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  roleTypes: any;
  login: any;
  modalMode: any;
  role: any;
}

const b = block('edit-operators');
const selector = formValueSelector('editOperators');

type IFormProps = FormProps<IOperator, IOwnProps, {}> & IOwnProps&IStateProps ;

function mapStateToProps(state: IReduxState): IStateProps {
  const roles = state.showResource.short.roles;
  let processedSource: any[] = [];
  const modalMode = state.settings.modalMode || '';

  if (roles && roles.length > 0) {
    processedSource = roles.map((s: any) => ({value: s.name, label: s.name}));
  }

  let login = null;
  let role = null;
  if(state.form.hasOwnProperty('editOperators')){
    if(state.form.editOperators.hasOwnProperty("values")){
      login = state.form.editOperators.values.login
    }
    if(state.form.editOperators.hasOwnProperty("initial")){
      role = state.form.editOperators.initial.authorities[0].name
    }
  }
  
  return {
    roleTypes: processedSource,
    login: login,
    modalMode: modalMode,
    role: role
  };
}
@reduxForm<IOperator, IOwnProps, {}>({
  form: 'editOperators',
  validate,
})

class EditOperators extends React.PureComponent<IFormProps , {}> {
  public render() {
    const { invalid, pristine, error, roleTypes, login, modalMode, role } = this.props;

    let currentRole = false;
    if(role == 'admin') {
      currentRole = true
    }

    let disabled = login == 'admin' ? true : false
    if(modalMode == 'create') {disabled = false}

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label={i18next.t('EditOperators.login')}
          name="login"
          component={this._renderField}
          type="text"
          disabled = {disabled || currentRole}
        />
        <Field
          label={i18next.t('EditOperators.password')}
          name="password"
          component={this._renderField}
          type="password"
        />
        <Field
          label={i18next.t('EditOperators.email')}
          name="email"
          component={this._renderField}
          type="text"
          disabled = {disabled}
        />
        <Field
          label={i18next.t('EditOperators.role')}
          name="role"
          component={this.renderActionField}
          source={roleTypes}
          disabled = {disabled}
        />
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('EditOperators.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('EditOperators.save')}
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
  private renderActionField(field: WrappedFieldProps<{}> & IDropdownProps) {
    const { roleTypes, login, modalMode, role } = this.props;
    const { input: { value, ...inputProps }, ...fieldProps } = field;
    let processedValue = value.name;
/*
    let currentRole = false;
    if(role && role.name == 'admin') {
      currentRole = true
    }
    */
    let disabled = login == 'admin' ? true : false
    if(modalMode == 'create') {disabled = false}

    return (
      <StatefulDropdown
        {...field}
        {...field.input}
//        value={processedValue}
        source={roleTypes}
        disabled = {disabled}
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

}

export { EditOperators };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(EditOperators);
