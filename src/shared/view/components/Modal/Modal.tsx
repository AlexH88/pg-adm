import * as React from 'react';
import ReactModal from 'react-modal';
import {block} from 'bem-cn';
import './Modal.styl';

interface IProps {
  isOpen: boolean;
  title: string | JSX.Element;
  onClose(): void;
  style?: any;
}

const b = block('modal');

class Modal extends React.PureComponent<IProps, {}> {
  public render() {
    const { children, isOpen, onClose, title, style = {} } = this.props;
    return (
      <ReactModal
        className={b()}
        overlayClassName={b('overlay').toString()} // Mysterious type warning ensues if not cast to string manually
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Modal"
        style={style}
      >
        <div className={b('header')}>
          <div className={b('title')}>{title}</div>
          <div className={b('close')} onClick={onClose} />
        </div>
        <div className={b('content')}>
          {children}
        </div>
      </ReactModal>
    );
  }
}
export default Modal;
