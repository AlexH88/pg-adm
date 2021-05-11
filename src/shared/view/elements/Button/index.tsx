import * as React from 'react';
import {block} from 'bem-cn';
import {Button as ToolboxButton} from 'react-toolbox/lib/button';
import * as styles from './style.styl';

interface IOwnProps {
  label: string;
  disabled?: boolean;
  isPrimary?: boolean;
  theme?: string;
  type?: string;
  onClick?(): void;
}

class Button extends React.Component<IOwnProps, {}> {

  private b = block('regularButton');

  public render() {
    const b = this.b;
    const { onClick, label, disabled, theme, type, isPrimary } = this.props;
    return (
      <div className={b()}>
        <ToolboxButton
          theme={theme ? theme : styles}
          ripple
          raised
          primary={isPrimary}
          disabled={disabled}
          label={label}
          onClick={onClick}
          type={type}
        />
      </div>
    );
  }
}

export default Button;
