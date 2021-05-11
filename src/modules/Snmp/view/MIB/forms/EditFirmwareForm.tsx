import * as React from 'react';
import {connect} from 'react-redux';
// import { IReduxState } from 'shared/types/app';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ICheckboxProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {IPrinter} from 'shared/types/printers';
import {validateOidForm} from 'shared/helpers/validators/validatePrinterEdition';
import './EditFirmwareForm.styl';
import Currency from '../../../../../shared/view/elements/CurrencyInput/index';

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  isMagentaToner: boolean;
  isYellowToner: boolean;
  isCyanToner: boolean;
  isBlackToner: boolean;
}

const b = block('edit-printer');

type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps&IStateProps ;

const selector = formValueSelector('edit_firmware');

function mapStateToProps(state: any): IStateProps {
  return {
    isYellowToner: selector(state, 'isYellowToner') as boolean,
    isCyanToner: selector(state, 'isCyanToner') as boolean,
    isMagentaToner: selector(state, 'isMagentaToner') as boolean,
    isBlackToner: selector(state, 'isBlackToner') as boolean,
  };
}

@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'edit_firmware',
  validate: validateOidForm
})

class EditFirmwareForm extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { invalid, pristine, error, isYellowToner, isCyanToner, isMagentaToner, isBlackToner } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div className={b('fields-wrapper')}>
        <Field
          label="Наименование"
          name="firmware"
          component={this._renderField}
          type="text"
        />
        <Field
          label="OID"
          name="oid"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Производитель"
          name="vendor"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Статус печати"
          name="printing_status"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Статус устройства"
          name="device_status"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Черный тонер"
          name="isBlackToner"
          type="checkbox"
          component={this._renderCheckboxField}
        />
        {
          isBlackToner &&
          <div>
            <Field label="Чёрный тонер макс." name="black_toner_max" component={this._renderField} type="text" />
            <Field label="Чёрный тонер" name="black_toner_current" component={this._renderField} type="text" />
            <Field label="Чёрный тонер %" name="black_toner_percent" component={this._renderField} type="text" />
          </div>
        }
        <br />
        <Field
          label="Жёлтый тонер"
          name="isYellowToner"
          type="checkbox"
          component={this._renderCheckboxField}
        />
        {
          isYellowToner &&
          <div>
            <Field label="Жёлтый тонер макс." name="yellow_toner_max" component={this._renderField} type="text" />
            <Field label="Жёлтый тонер" name="yellow_toner_current" component={this._renderField} type="text" />
            <Field label="Жёлтый тонер %" name="yellow_toner_percent" component={this._renderField} type="text" />
          </div>
        }
        <br />
        <Field
          label="Голубой тонер"
          name="isCyanToner"
          type="checkbox"
          component={this._renderCheckboxField}
        />
        {
          isCyanToner &&
          <div>
            <Field label="Голубой тонер макс." name="cyan_toner_max" component={this._renderField} type="text" />
            <Field label="Голубой тонер" name="cyan_toner_current" component={this._renderField} type="text" />
            <Field label="Голубой тонер %" name="cyan_toner_percent" component={this._renderField} type="text" />
          </div>
        }
        <br />
        <Field
          label="Фиолетовый тонер"
          name="isMagentaToner"
          type="checkbox"
          component={this._renderCheckboxField}
        />
        {
          isMagentaToner &&
          <div>
            <Field label="Фиолетовый тонер макс." name="magenta_toner_max" component={this._renderField} type="text" />
            <Field label="Фиолетовый тонер" name="magenta_toner_current" component={this._renderField} type="text" />
            <Field label="Фиолетовый тонер %" name="magenta_toner_percent" component={this._renderField} type="text" />
          </div>
        }
        </div>
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
  private _renderCurrencyField(field: any) {
    return (
      <Currency
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

}

export { EditFirmwareForm };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(EditFirmwareForm);
