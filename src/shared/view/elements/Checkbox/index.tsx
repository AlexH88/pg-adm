import * as React from 'react';
import {block} from 'bem-cn';
import ToolboxCheckbox from 'react-toolbox/lib/checkbox';
import * as mainTheme from './style.styl';
import * as greyTheme from './style-grey.styl';

interface IOwnProps {
  name?: string;
  label: string;
  theme?: string;
  disabled?: boolean;
  checked?: boolean;
  littleStyle?: boolean;
  isGreyTheme?: boolean;
  onChange?: Function;
  onBlur?: Function;
  className?: string;
}

class Checkbox extends React.Component<IOwnProps, {}> {

  private b = block('checkbox-wrapper');

  public render() {
    const b = this.b;
    const { onChange, onBlur, checked, name, label, littleStyle, disabled, isGreyTheme, theme } = this.props;
    const selectTheme = theme ? theme : (isGreyTheme ? greyTheme : mainTheme);
    return (
      <div className={b({ little: littleStyle, grey: isGreyTheme, disabled })}>
        <ToolboxCheckbox
          name={name}
          theme={selectTheme}
          label={label}
          onChange={onChange}
          onBlur={onBlur}
          checked={checked}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default Checkbox;
export {
  IOwnProps as ICheckboxProps
}
