import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, ITextInputProps, TextInput} from '../../../../shared/view/elements';
import {IPrinter} from '../../../../shared/types/printers';
import '../../../../modules/Agents/view/GroupsPC/AddHostGroup/AddPrinterGroup.styl';
import { validate } from 'shared/helpers/validators/validateChangePassword';

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

const b = block('add-group');

type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps;

@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'сhangePassword',
  validate
})

class ChangePassword extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { invalid, pristine, error } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field label="Старый пароль*" name="oldPassword" component={this._renderField} type="password" disabled={false} />
        <Field label="Новый пароль*" name="newPassword" component={this._renderField} type="password" disabled={false} />
        <Field label="Повторите новый пароль*" name="repeatNewPassword" component={this._renderField} type="password" disabled={false} />

        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={this.handleCancel}
          />
          <Button
            label="Отправить"
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
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }
}

export default ChangePassword;
