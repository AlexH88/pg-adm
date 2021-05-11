import * as React from 'react';
import {bind} from 'decko';
import {Icon} from 'shared/view/elements';
import {Iicon} from 'shared/types/app';

interface IOwnProps {
  icon: Iicon;
  onClick?: (param?: any) => void;
  id?: number;
  mode?: string;
  idHash?: string;
  title?: string;
}

class ActionFormatter extends React.PureComponent<IOwnProps, {}> {

  public render() {
    const { icon, title, idHash } = this.props;
    return (
      <Icon 
        icon={icon}
        onClick={this.onClick}
        title={title ? title : null}
        id={idHash ? idHash : null}
      />
    );
  }

  @bind
  private onClick() {
    if (this.props.onClick) {
      this.props.mode
        ? this.props.onClick({id: this.props.id, mode: this.props.mode})
        : this.props.onClick(this.props.id);
    }
  }

}

export default ActionFormatter;
