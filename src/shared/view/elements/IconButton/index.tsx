import * as React from 'react';
import {block} from 'bem-cn';
import {Button as ToolboxButton} from 'react-toolbox/lib/button';
import * as styles from './style.styl';

interface IOwnProps {
  style?: any;
  label?: string;
  disabled?: boolean;
  isPrimary?: boolean;
  theme?: string;
  type?: string;
  onClick?(): void;
  icon: any;
  title?: string;
  id?: string;
}

class IconButton extends React.Component<IOwnProps, {}> {

  private b = block('iconButton');

  public render() {
    const b = this.b;
    const {
      onClick,
      label,
      disabled,
      theme,
      type,
      isPrimary,
      icon,
      style,
      title,
      id
    } = this.props;

    return (
      <div className={b()}>
        <ToolboxButton
          theme={theme ? theme : styles}
          style={style}
          ripple
          raised
          primary={isPrimary}
          disabled={disabled}
          label={label}
          onClick={onClick}
          type={type}
          title={title ? title : null}
          id={id ? id : null}
        >
          {icon}
        </ToolboxButton>
      </div>
    );
  }
}

export default IconButton;
