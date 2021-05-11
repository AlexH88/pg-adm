import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, ITextInputProps, TextInput} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validateUserCreation';
import {IUser} from 'shared/types/users';
import {IMode} from '../../../namespace';
import './AddUserForm.styl';
import Currency from 'shared/view/elements/CurrencyInput/index';
import i18next from "i18next";

interface IOwnProps {
  mode: IMode;
  onCancel(): void;
  onSave(): void;
}

const b = block('add-user');

type IFormProps = FormProps<IUser, IOwnProps, {}> & IOwnProps;

@reduxForm<IUser, IOwnProps, {}>({
  form: 'addUsers',
  validate,
})

class AddUserForm extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { mode, invalid, pristine, error} = this.props;
    const isPartial = mode === 'partial-edit';
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label={i18next.t('AddUserForm.login')}
          name="login"
          component={this._renderField}
          type="text"
          disabled={isPartial}
        />
        <Field
          label={i18next.t('AddUserForm.name')}
          name="name"
          component={this._renderField}
          type="text"
          disabled={isPartial}
        />
        {
          isCreate || isEdit
            ? <Field
                label={i18next.t('AddUserForm.email')}
                name="email"
                component={this._renderField}
                type="email"
              />
            : null
        }
          <Field
            label={i18next.t('AddUserForm.card')}
            name="card"
            component={this._renderField}
            type="text"
          />
          <Field
            label={i18next.t('AddUserForm.balance')}
            name="balance"
            prefix="₽"
            component={this._renderCurrencyField}
            type="number"
          />

          <span className={b('general-error')}>{error}</span>
        
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddUserForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddUserForm.save')}
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
  private _renderCurrencyField(field: any) {
    return (
      <Currency
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

}

export default AddUserForm;
