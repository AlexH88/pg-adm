import * as React from 'react';
import {block} from 'bem-cn';
import './style.styl';

interface IOwnProps {
  icon: 'trash' | 'pen' | 'folder' | 'sync' | 'dummy' | 'trash_off' | 'pen_off' | 'folder_off' | 'sync_off' | 'watermarks' | 'unsync' | 'unsync_off';
  onClick?: any;
  title?: string;
  id?: string;
  idHash?: string;
}

class Icon extends React.Component<IOwnProps, {}> {
  private b = block('icon');

  public render() {
    const b = this.b;
    const { icon, onClick, title, id, idHash } = this.props;
    const hash = idHash || id
    return (
      <div
        onClick={icon.indexOf('_off') === -1 ? onClick : ()=>{}}
        className={b({ [icon]: true })}
        title={title ? title : null}
        id={hash}
      />
    );
  }
}

export default Icon;
