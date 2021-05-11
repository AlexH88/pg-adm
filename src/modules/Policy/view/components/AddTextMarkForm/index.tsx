import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ITextInputProps, TextInput} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validatePolicy';
import {IPolicy} from 'shared/types/policy';
import './style.styl';
import {Card} from 'react-toolbox/lib/card';
import './CheckboxMultiselect.styl';
import {ICheckboxProps} from 'shared/view/elements/Checkbox';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

const b = block('add-policy');
const b2 = block('popover');

type TypeFormProps = FormProps<IPolicy, IOwnProps, { showHint: boolean}> & IOwnProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: 'add_text_labels',
  validate,
})

class AddTextMarkForm extends React.PureComponent<TypeFormProps, {}> {

  state = {
    showHint: false,
  }

  public render() {
    const { invalid, pristine, error } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field label={i18next.t('AddTextMarkForm.name')} name="name" component={this._renderInputField} type="text"/>
        <Field label={i18next.t('AddTextMarkForm.tag')} name="data" component={this._renderTextAreaField} type="text"/>
        <Field label={i18next.t('AddTextMarkForm.encrypted')} name="encrypted" component={this.renderCheckbox} type="checkbox" />
        <br />
        <div
          className={b('hint')}
          onMouseEnter={() => { this.setState({ showHint: true }) }}
          onMouseLeave={() => { this.setState({ showHint: false }) }}
        >
          Справка
        </div>
        <div style={{position: 'absolute', width: '300px'}}>
          <div className={b2()} style={{display: this.state.showHint ? 'inline-block' : 'none' }}>
            <Card
              style={{padding: '5px', color: 'black'}}
            >
              <div><b>$user</b> - {i18next.t('AddTextMarkForm.user')}</div>
              <div><b>$printer</b> - {i18next.t('AddTextMarkForm.printer')}</div>
              <div><b>$time</b> - {i18next.t('AddTextMarkForm.printTime')}</div>
              <div><b>$data</b> - {i18next.t('AddTextMarkForm.printDate')}</div>
              <div><b>$host</b> - {i18next.t('AddTextMarkForm.hostName')}</div>
            </Card>
          </div>
        </div>
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddTextMarkForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddTextMarkForm.save')}
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

  @bind
  private renderCheckbox(field: WrappedFieldProps<{}> & ICheckboxProps) {
    return (
      <Checkbox
        {...field}
        {...field.input}
      />
    );
  }

  @bind
  private _renderTextAreaField(field: WrappedFieldProps<{}> & ITextInputProps) {
    const { touched, error } = field.meta;
    return (
      <TextInput
        {...field.input}
        {...field}
        error={touched && error ? error : false}
        multiline
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

export default AddTextMarkForm;
