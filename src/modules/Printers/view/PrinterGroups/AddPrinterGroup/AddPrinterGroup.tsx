import * as React from 'react';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {connect} from 'react-redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, ITextInputProps, TextInput} from 'shared/view/elements';
import {IPrinter} from 'shared/types/printers';
import {IReduxState} from 'shared/types/app';
import {validate} from 'shared/helpers/validators/validateAddPrinterGroup';
import './AddPrinterGroup.styl';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  type?: string;
  initialValues: any;
}

const selector = formValueSelector('add_printergroups');

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    type: selector(state, 'type') as string,
    initialValues: {
      initialRestricted: false,
    }
  };
}

const b = block('add-group');

type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'add_printergroups',
  validate
})
class AddPrinterGroup extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { invalid, pristine, error } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label="Наименование*"
          name="name"
          component={this._renderField}
          type="text"
          disabled={false}
        />
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddPrinterGroup.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddPrinterGroup.save')}
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

export {AddPrinterGroup};

export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(AddPrinterGroup);
