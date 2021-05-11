import * as React from 'react';
import {block} from 'bem-cn';
import ToolboxDropdown from 'react-toolbox/lib/dropdown';
import * as theme from './theme.styl';

interface IOwnProps {
  label: string;
  disabled?: boolean;
  value?: string;
  source: Array<{ value: string, label: string }>;
  onChange: Function;
  onBlur?: Function;
  error?: string;
}

class Dropdown extends React.Component<IOwnProps, {}> {

  private b = block('dropdown');

  public render() {
    const b = this.b;
    const { onChange, onBlur, value, source, label, disabled, error } = this.props;

    return (
      <div className={b('wrapper')}>
        <ToolboxDropdown
          auto={false}
          theme={theme}
          label={label}
          disabled={disabled}
          source={source}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          error={error}
        />
      </div>
    );
  }
}

export default Dropdown;
export {
  IOwnProps as IDropdownProps
}
