import * as React from 'react';
import {connect} from 'react-redux';
import {IReduxState} from 'shared/types/app';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ICheckboxProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {IPrinter} from 'shared/types/printers';
import {validate} from 'shared/helpers/validators/validatePrinterEdition';
import './EditPrinterForm.styl';

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  isCheck?: boolean;
  host?: string;
}

const b = block('edit-printer');

type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps&IStateProps ;

const selector = formValueSelector('edit_printers');

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    isCheck: selector(state, 'is_followme' ) as boolean,
    host: selector(state, 'host' ) as string,
  };
}
@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'edit_printers',
  validate,
})

class EditPrinterForm extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { invalid, pristine, error, isCheck } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label="Наименование"
          name="name"
          component={this._renderField}
          type="text"
          format={this.formattingName}
          disabled
        />
        <Field label="Цена" name="price" component={this._renderField} type="text" />
        <Field
            label="Двухфакторная аутентификация"
            name="is_followme"
            type="checkbox"
            component={this._renderCheckboxField}
        />
        <Field
          label="Идентификатор считывателя*"
          name="rfidr_uid"
          component={this._renderField}
          type="text"
          disabled={!isCheck}
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
  private _renderCheckboxField(field: WrappedFieldProps<{}>&ICheckboxProps) {
    return (
      <Checkbox
        {...field.input}
        {...field}
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
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

  @bind
  private formattingName(value: string): string {
    return `${this.props.host}/${value}`;
  }

}

export { EditPrinterForm };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(EditPrinterForm);
