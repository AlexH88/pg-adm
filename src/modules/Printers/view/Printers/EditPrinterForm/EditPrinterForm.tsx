import * as React from 'react';
import {connect} from 'react-redux';
// import { IReduxState } from 'shared/types/app';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ICheckboxProps, IDropdownProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {IPrinter} from 'shared/types/printers';
import {validate} from 'shared/helpers/validators/validatePrinterEdition';
import './EditPrinterForm.styl';
import Currency from '../../../../../shared/view/elements/CurrencyInput/index';
import IpInput from '../../../../../shared/view/elements/IpInput/index';
import StatefulDropdown from 'shared/view/components/StatefulDropdown';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  host?: any;
  formatPrice: boolean;
  colorPrice: boolean;
  duplexPrice: boolean;
  rfid: boolean;
  readers: any;
  snmpPageCounter: boolean;
  reader: any;
  printerIp: string;
//  price: number;
}

const b = block('edit-printer');

type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps&IStateProps ;

const selector = formValueSelector('editPrinters');

function mapStateToProps(state: any): IStateProps {
  const { short: { readers } = { readers: [] } } = state.showResource;

  const processSource = (source: any) => {
    let processedSource: any[] = [];
    if (source && source.items && source.items.length > 0) {
      processedSource = source.items.map((s: any) => ({ label: s.uid, value: s.uid.toString() }));
    }
    return processedSource;
  }

  return {
    host: selector(state, 'host') as object,
    formatPrice: selector(state, 'formatPrice') as boolean,
    colorPrice: selector(state, 'colorPrice') as boolean,
    duplexPrice: selector(state, 'duplexPrice') as boolean,
    rfid: selector(state, 'rfid') as boolean,
    readers: processSource(readers),
    snmpPageCounter: selector(state, 'snmpPageCounter') as boolean,
    reader: selector(state, 'reader') as any,
    printerIp: selector(state, 'printerIp') as string,
//    price: selector(state, 'price') as number,
  };
}

@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'editPrinters',
  validate,
})

class EditPrinterForm extends React.PureComponent<IFormProps, {}> {

  public render() {
    const { invalid, pristine, error, formatPrice, colorPrice, duplexPrice, rfid, readers, printerIp } = this.props;
    let disableIp = true;
    if(printerIp){
      disableIp = false
    }
    if(printerIp == '...'){
      disableIp = true
    }

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label={i18next.t('EditPrinterForm.name')}
          name="name"
          component={this._renderField}
          type="text"
          format={this.formattingName}
          disabled={true}
        />

        <Field label="Цена" prefix="₽" name="price" component={this._renderCurrencyField} type="number" format={this.formattingPrice} disabled={!!formatPrice} />
        <Field
          label="IP-адрес"
          name="printerIp"
//          component={this._renderField}
          component={this._renderIpField}
          type="text"
//          disabled={true}
        />
        <Field label="Цена с учетом формата" name="formatPrice" type="checkbox" component={this._renderCheckboxField} />
        {formatPrice && (
          <div>
            <Field label={i18next.t('EditPrinterForm.PriceA3')} prefix="₽" name="a3Price" component={this._renderCurrencyField} type="number" />
            <Field label={i18next.t('EditPrinterForm.PriceA4')} prefix="₽" name="a4Price" component={this._renderCurrencyField} type="number" />
            <Field label={i18next.t('EditPrinterForm.PriceA5')} prefix="₽" name="a5Price" component={this._renderCurrencyField} type="number" />
          </div>
        )}
        <Field label={i18next.t('EditPrinterForm.colorPrice')} name="colorPrice" type="checkbox" component={this._renderCheckboxField} />
        {colorPrice && (
          <Field
            label={i18next.t('EditPrinterForm.colorCoeff')}
            name="colorCoeff"
            component={this._renderField}
            step="0.1"
            type="number"
          />
        )}
        <Field label={i18next.t('EditPrinterForm.duplexPrice')} name="duplexPrice" type="checkbox" component={this._renderCheckboxField} />
        {duplexPrice && (
          <Field
            label={i18next.t('EditPrinterForm.duplexCoeff')}
            name="duplexCoeff"
            component={this._renderField}
            step="0.1"
            type="number"
          />
        )}
        <Field
            label={i18next.t('EditPrinterForm.rfid')}
            name="rfid"
            type="checkbox"
            component={this._renderCheckboxField}
        />
        {rfid && (
          <Field
            label={i18next.t('EditPrinterForm.uid')}
            name="uid"
            component={this._renderActionField.bind(this, readers)}
            type="text"
            disabled={!rfid}
          />
        )}
        <Field
          label="SNMP"
          // name="snmp_active"
          name="snmp"
          type="checkbox"
          component={this._renderCheckboxField}
          disabled={disableIp}
        />
        <Field
          label="Аппаратный подсчет страниц (SNMP)"
          // name="snmp_active"
          name="snmpPageCounter"
          type="checkbox"
          component={this._renderCheckboxField}
          disabled={disableIp}
        />
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('EditPrinterForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('EditPrinterForm.save')}
            disabled={invalid || pristine || this.isValidIp()}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private isValidIp() {
    const { printerIp } = this.props;
    if(printerIp) {
        if(printerIp.includes('...') &&printerIp.length == 3) {
          return false
        }
        if(printerIp.includes('..') || /*printerIp.includes('...') ||*/ printerIp.slice(-1) == '.' || printerIp.slice(0,1) == '.' ) {
          return true
        }
    }
    return false
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
  private _renderIpField(field: any) {
    return (
      <IpInput
        {...field.input}
        {...field}
      />
    );
  }

  @bind
  private _renderActionField(readers: any[], field: WrappedFieldProps<{}> & IDropdownProps) {
    let { input: { value, ...inputProps }, ...fieldProps } = field;
    const {reader} = this.props

    if(reader && value == '') {
      value = reader.uid
    }

    return (
      <StatefulDropdown
        {...fieldProps}
        {...inputProps}
        value={value}
        source={readers}
        clear={true}
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
    const { name } = this.props.host;
    return `${name}/${value}`;
  }

  @bind
  private formattingPrice(value: number): number {
//    const { price } = this.props;
    return value;
  }

}

export { EditPrinterForm };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(EditPrinterForm);
