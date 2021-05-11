import * as React from 'react';
import {block} from 'bem-cn';
import {Modal} from 'shared/view/components';
import {Button} from 'shared/view/elements';
import './style.styl';
import i18next from "i18next";

interface IProps {
  isOpen: boolean;
  alertMessage: string;
  title: string;
  onClose(): void;
}

const b = block('alert-modal');

class AlertModal extends React.PureComponent<IProps, {}> {
  public render() {
    const { isOpen, onClose, title, alertMessage, children } = this.props;
    const titleComponent = (
      <span className={b('title')}>
        {title}
        <span className={b('danger')} />
      </span>
    );
    return (
      <Modal
        isOpen={isOpen}
        title={titleComponent}
        onClose={onClose}
      >
        <div className={b('content')}>
          {alertMessage}
        </div>
        <div className={b('footer')}>
          {children}
        </div>
      </Modal>
    );
  }
}
export default AlertModal;
