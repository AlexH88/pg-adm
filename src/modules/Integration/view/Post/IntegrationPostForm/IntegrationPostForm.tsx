import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ITextInputProps, TextInput, ICheckboxProps, PasswordInput} from 'shared/view/elements';
import Dropdown from 'shared/view/components/StatefulDropdown';
import {validate} from 'shared/helpers/validators/validatePostConnection';
import {IMode} from '../../../namespace';
import {actions} from '../../../redux';
import {connect} from 'react-redux';
import { IReduxState } from 'shared/types/app';
import './style.styl';

interface IOwnProps {
  mode: IMode;
  onCancel(): void;
  onSave(): void;
  onConnect(): void;
  testConnentClear: typeof actions.testConnentClear;
}

interface IStateProps {
  success: string;
}

interface IIntegrationPostForm {
  id: number;
  host: string;
  port: string;
  sender: string;
  password: string;
  login: string;
}

function mapStateToProps(state: IReduxState): IStateProps {
  return {
     success: state.integration.success
  };
}

const b = block('add_settings_post');

type TypeFormProps = FormProps<IIntegrationPostForm, IOwnProps, {}> & IStateProps & IOwnProps ;

@reduxForm<IIntegrationPostForm, IOwnProps, {}>({
  form: 'addSettingsPost',
  validate,
})

class IntegrationPostForm extends React.PureComponent<TypeFormProps , {}> {
  componentWillUnmount() {
    const { testConnentClear } = this.props;
    testConnentClear();
  }

  public render() {
    const { invalid, pristine, error, success} = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label="Хост"
          name="host"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Порт"
          name="port"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Отправитель"
          name="sender"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Логин"
          name="username"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Пароль"
          name="password"
          component={this._renderPasswordField}
          type="password"
        />


        <Field
          label="Авторизация"
          name="authEnabled"
          type="checkbox"
          component={this._renderCheckboxField}
        />

        <Field
          label="SSL"
          name="sslEnabled"
          type="checkbox"
          component={this._renderCheckboxField}
        />

        <Field
          label="TLS"
          name="starttlsEnabled"
          type="checkbox"
          component={this._renderCheckboxField}
        />

        <span className={b('general-error')}>{error}</span>
        {success === "Соединение успешно установлено" 
            ? 
          <span className={b('success')}>{success}</span> 
            :  
          <span className={b('general-error')}>{success}</span>
        }

        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={this.handleCancel}
          />
          <Button
            label="Проверить подключение"
            onClick={this.handleTest}
          />
          <Button
            label="Сохранить"
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private _renderPasswordField(field: any) {
    const { touched, error } = field.meta;
    return (
      <PasswordInput
        {...field.input}
        {...field}
        error={touched && error ? error : false}
      />
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
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }
  @bind

  private handleTest(): void {
    this.props.onConnect();
  }

}


export { IntegrationPostForm };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(IntegrationPostForm);
