import * as React from 'react';
import { block } from 'bem-cn';
import { RadioButton as ToolboxRadioButton, RadioGroup as ToolboxRadioGroup } from 'react-toolbox/lib/radio';
import * as theme from './style.styl';


interface IOwnProps {
  disabled?: boolean;
  name: string;
  value?: boolean | string;
  values: Array<{ value: boolean | string, label: string}>;
  checked?: boolean;
  onChange?: Function;
  onBlur?: Function;
  label?: string;
  printerSize?: any;
  printerSizeX?: any;
}

class RadioGroup extends React.Component<IOwnProps, {}> {

  private b = block('radio-group-wrapper');

  public render() {
    const b = this.b;
    const { onChange, onBlur, name, values, value = false, disabled, label, printerSize, printerSizeX } = this.props;
    return (
      <div className={b()}>
        <h4>{label}</h4>
        <ToolboxRadioGroup 
          name={name} 
          onChange={ printerSize ? (e) => printerSizeX(e) : onChange} 
          value={value || 'UPDATE'}
        >
          {
            values.map(({value, label}, i) => (
              <ToolboxRadioButton
                key={i}
                theme={theme}
                disabled={disabled}
                onBlur={onBlur}
                value={value}
                label={label}
              />
            ))
          }
        </ToolboxRadioGroup>
      </div>
    );
  }
}



export default RadioGroup;

export {
  IOwnProps as IRadioGroupProps
}
