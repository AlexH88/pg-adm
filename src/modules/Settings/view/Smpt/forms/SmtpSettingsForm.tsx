import * as React from 'react';
import {connect} from 'react-redux';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ICheckboxProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {IPrinter} from 'shared/types/printers';
import {validate} from 'shared/helpers/validators/validatePrinterEdition';

interface IOwnProps {
  onSave(): void;
}

interface IStateProps {
  isCheck?: boolean;
  host?: string;
  active: boolean;
  enabled: boolean;
}

const b = block('edit-printer');

type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps&IStateProps ;

const selector = formValueSelector('smtp');

function mapStateToProps(state: any): IStateProps { // TODO Поправить!
    return {
      isCheck: selector(state, 'is_followme' ) as boolean,
      host: selector(state, 'host') as string,
      active: selector(state, 'active') as boolean,
      enabled: selector(state, 'enabled') as boolean,
    };
}

@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'smtp',
  validate,
})

// interface ISmtpConfig {
//   active: boolean;
//   host: string;
//   port: number;
//   secure: boolean;
//   username: string;
//   password: string;
// }

class SmtpSettingsForm extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { invalid, pristine, error, active, enabled } = this.props;
    console.log(active);
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div style={{margin: '0 0 20px 0'}}>
          <span><b>Статус:</b> </span> { active ? <span style={{color: 'green'}}>Подключено</span> : <span style={{color: 'red'}}>Не подключено</span>}
        </div>
        <Field label="Активировать" name="enabled" type="checkbox" component={this._renderCheckboxField} />
        <br />
        <Field disabled={!enabled} label="Шифрование" name="secure" type="checkbox" component={this._renderCheckboxField} />
        <Field
          disabled={!enabled}
          label="Хост"
          name="hostname"
          component={this._renderField}
          type="text"
        />
        <Field disabled={!enabled} label="Порт" name="port" component={this._renderField} type="number" />
        <Field
          disabled={!enabled}
          label="Имя пользователя"
          name="username"
          component={this._renderField}
          type="text"
        />
        <Field
          disabled={!enabled}
          label="Пароль"
          name="password"
          component={this._renderField}
          type="password"
        />
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label="Сохранить"
            disabled={invalid || pristine || !enabled}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private _renderCheckboxField(field: WrappedFieldProps<{}>&ICheckboxProps) {
    return (
      <Checkbox
        {...field.input}
        {...field}
      />
    );
  }

  // @bind
  // private _renderCurrencyField(field: any) {
  //   return (
  //     <Currency
  //       {...field.input}
  //       {...field}
  //     />
  //   );
  // }

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
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  // @bind
  // private handleCancel(): void {
  //   this.props.onCancel();
  // }

  // @bind
  // private formattingName(value: string): string {
  //   console.log(this.props);
  //   return `${this.props.host}/${value}`;
  // }

}

export { SmtpSettingsForm };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(SmtpSettingsForm);
