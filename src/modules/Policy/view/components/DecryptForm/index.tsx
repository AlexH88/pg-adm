import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, ITextInputProps, TextInput} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validatePolicy';
import {IPolicy} from 'shared/types/policy';
import './style.styl';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
  message: string;
}

const b = block('decrypt');

type TypeFormProps = FormProps<IPolicy, IOwnProps, { showHint: boolean}> & IOwnProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: 'decrypt',
  validate,
})

class DecryptForm extends React.PureComponent<TypeFormProps, {}> {

  state = {
    showHint: false,
  }

  public render() {
    const { invalid, pristine, error, message } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field label={i18next.t('AddTextMarkForm.Cipher')} name="result" component={this._renderInputField} type="text"/>
        <br />
        <div style={{textAlign: 'center'}}>
          {message}
        </div>
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddTextMarkForm.Decrypt')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private _renderInputField(field: WrappedFieldProps<{}> & ITextInputProps) {
    const { touched, error } = field.meta;
    return (
      <TextInput
        {...field.input}
        {...field}
        error={touched && error ? error : false}
      />
    );
  }


  // @bind
  // private _renderTextAreaField(field: WrappedFieldProps<{}> & ITextInputProps) {
  //   const { touched, error } = field.meta;
  //   return (
  //     <TextInput
  //       {...field.input}
  //       {...field}
  //       error={touched && error ? error : false}
  //       multiline
  //     />
  //   );
  // }

  @bind
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  // @bind
  // private handleCancel(): void {
  //   this.props.onCancel();
  // }

}

export default DecryptForm;
