import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, IDropdownProps, ITextInputProps, TextInput} from 'shared/view/elements';
import Dropdown from 'shared/view/components/StatefulDropdown';
import {ISnmpConfigEntry} from 'shared/types/snmpConfigEntry';
import {validateName} from 'shared/helpers/validators/validateSnmpConfig';
import './style.styl';

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

const fieldTypes = [
  'MODEL',
  'DESCR',
  'SERIAL',
  'ETH',
  'MAC',
  'DATE',
  'UPTIME',
  'PRINTED',
  'STATUS',
  'OTHER',
  'CYAN',
  'MAGENTA',
  'YELLOW',
  'BLACK',
  'SUPPLIES',
];

const b = block('edit-snmp-config-entry');

type IFormProps = FormProps<ISnmpConfigEntry, IOwnProps, {}> & IOwnProps;

@reduxForm<ISnmpConfigEntry, IOwnProps, {}>({
  form: 'editSnmpConfigItem',
  validate: validateName,
})

class EditSnmpConfigEntry extends React.PureComponent<IFormProps, {}> {
  public render() {
    const {
      invalid,
      pristine
    } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div className={b('fields-block')}>
          <Field
            label="name"
            name="name"
            component={this._renderField}
            type="text"
          />
          <div style={{ marginRight: '16px' }}>
            <Button
              label="Отмена"
              onClick={this.handleCancel}
            />
          </div>
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
      <div  style={{ flex: '1 1 100px', marginRight: '16px', marginTop: '4px' }}>
        <TextInput
          {...field.input}
          {...field}
          error={touched && error ? error : false}
        />
      </div>
    );
  }

  @bind
  private _renderDropdownField(field: WrappedFieldProps<{}> & IDropdownProps, source: any) {
    const {
      meta,
      input: {
        value,
        ...inputProps
      },
      ...fieldProps
    } = field;

    return (
      <div  style={{ flex: '1 1 100px', marginRight: '16px', marginBottom: '18px', marginTop: '4px' }}>
        <Dropdown
          value={value ? value : ''}
          source={fieldTypes.map((s: any) => ({value: s, label: s}))}
          {...fieldProps}
          {...inputProps}
          //error={meta.error ? meta.error : undefined}
        />
      </div>
    );
  }

  @bind
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    console.log('this.props', this.props);
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }
}

export default EditSnmpConfigEntry;
