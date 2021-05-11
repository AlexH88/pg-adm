import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, ITextInputProps, TextInput} from 'shared/view/elements';
import './EditRoles.styl';
import {IRole} from 'modules/Settings/namespace';

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

const b = block('edit-roles');

type IFormProps = FormProps<IRole, IOwnProps, {}> & IOwnProps;

@reduxForm<IRole, IOwnProps, {}>({
  form: 'set_license_form',
})

class SetLicenseForm extends React.PureComponent<IFormProps , {}> {
  public render() {
    
    const { invalid, pristine, error } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label="Ключ"
          name="key"
          component={this._renderField}
          type="text"
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
        multiline
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

export { SetLicenseForm };
