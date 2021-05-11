import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, ITextInputProps, TextInput} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validateUserCreation';
import {IUser} from 'shared/types/users';
import {IMode} from '../../../namespace';
import './AddUserForm.styl';

interface IOwnProps {
  mode: IMode;
  onCancel(): void;
  onSave(): void;
}

const b = block('add-user');

type IFormProps = FormProps<IUser, IOwnProps, {}> & IOwnProps;

@reduxForm<IUser, IOwnProps, {}>({
  form: 'add_users',
  validate,
})
class AddUserForm extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { mode, invalid, pristine, error } = this.props;
    const isPartial = mode === 'partial-edit';
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field label="Логин*" name="login" component={this._renderField} type="text" disabled={isPartial} />
        <Field label="Имя*" name="name" component={this._renderField} type="text" disabled={isPartial}/>
        {
          isCreate || isEdit
          ?
            <Field label="Почта*" name="email" component={this._renderField} type="email"/>
          :
            null
        }
        {
          isCreate || isEdit
          ?
            <Field label="Номер карты*" name="card_id" component={this._renderField} type="text"/>
          :
            null
        }
          <Field
            label="Баланс*"
            name="balance"
            normalize={this.normalizeBalance}
            component={this._renderField}
            type="number"
          />
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={this.handleCancel}
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

  @bind
  private normalizeBalance(value: string): number {
    return parseInt(value, 10);
  }
}

export default AddUserForm;
