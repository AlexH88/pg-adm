import * as React from 'react';
import {connect} from 'react-redux';
// import { IReduxState } from 'shared/types/app';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ICheckboxProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {IPrinter} from 'shared/types/printers';
import {validate} from 'shared/helpers/validators/validatePrinterEdition';
import './EditPrinterForm.styl';
import Currency from '../../../../../shared/view/elements/CurrencyInput/index';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  isCheck?: boolean;
  host: any;
  formatPrice: boolean;
  colorPrice: boolean;
  duplexPrice: boolean;
}

const b = block('edit-printer');

type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps&IStateProps ;

const selector = formValueSelector('editPrinters');
if (!1) console.log(selector);

function mapStateToProps(state: any): IStateProps { // TODO Поправить!
  // let isCheck;
  // let host;
  //   try {
  //     isCheck = state.form.edit_printers.initial.is_followme as boolean;
  //     host = state.form.edit_printers.initial.host as string;
  //   } catch(e) {
  //     isCheck = false;
  //     host = '';
  //   }

    const processSource = (source: any) => {
      let processedSource: any[] = [];
      if (source && source.items && source.items.length > 0) {
        processedSource = source.items.map((s: any) => ({ label: s.uid, value: s.uid.toString() }));
      }
      return processedSource;
    }

    return {
      // isCheck,
      isCheck: selector(state, 'is_followme' ) as boolean,
      // host,
      host: selector(state, 'host') as object,
      formatPrice: selector(state, 'formatPrice') as boolean,
      colorPrice: selector(state, 'colorPrice') as boolean,
      duplexPrice: selector(state, 'duplexPrice') as boolean,
    };
}

@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'editPrinters',
  validate,
})

class EditPrinterForm extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { invalid, pristine, error/*, isCheck*/, formatPrice, colorPrice, duplexPrice } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label={i18next.t('EditPrinterForm.name')}
          name="name"
          component={this._renderField}
          type="text"
          format={this.formattingName}
          disabled
        />
        <Field label={i18next.t('EditPrinterForm.price')} prefix="₽" name="price" component={this._renderCurrencyField} type="number" />
        <Field label={i18next.t('EditPrinterForm.formatPrice')} name="formatPrice" type="checkbox" component={this._renderCheckboxField} />
        {
          formatPrice ?
          <div>
            <Field label={i18next.t('EditPrinterForm.PriceA3')} prefix="₽" name="a3Price" component={this._renderCurrencyField} type="number" />
            <Field label={i18next.t('EditPrinterForm.PriceA4')} prefix="₽" name="a4Price" component={this._renderCurrencyField} type="number" />
            <Field label={i18next.t('EditPrinterForm.PriceA5')} prefix="₽" name="a5Price" component={this._renderCurrencyField} type="number" />
          </div>
          :
          null
        }
        <Field label={i18next.t('EditPrinterForm.colorPrice')} name="colorPrice" type="checkbox" component={this._renderCheckboxField} />
        {
          colorPrice ?
            <Field label={i18next.t('EditPrinterForm.colorCoeff')} name="colorCoeff" component={this._renderField} type="number" />
          :
          null
        }
        <Field label={i18next.t('EditPrinterForm.duplexPrice')} name="duplexPrice" type="checkbox" component={this._renderCheckboxField} />
        {
          duplexPrice ?
            <Field label={i18next.t('EditPrinterForm.duplexCoeff')} name="duplexCoeff" component={this._renderField} type="number" />
          :
          null
        }
        <Field
            label={i18next.t('EditPrinterForm.rfid')}
            name="is_followme"
            type="checkbox"
            component={this._renderCheckboxField}
        />

        {/*<Field*/}
          {/*label="Идентификатор считывателя*"*/}
          {/*name="rfidr_uid"*/}
          {/*component={this._renderField}*/}
          {/*type="text"*/}
          {/*disabled={!isCheck}*/}
        {/*/>*/}
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('EditPrinterForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('EditPrinterForm.save')}
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
    return `${this.props.host.name}/${value}`;
  }

}

export { EditPrinterForm };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(EditPrinterForm);
