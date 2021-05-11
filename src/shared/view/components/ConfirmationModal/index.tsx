import * as React from 'react';
import {block} from 'bem-cn';
import {Modal} from 'shared/view/components';
import {Button} from 'shared/view/elements';
import './style.styl';

interface IProps {
  isOpen: boolean;
  alertMessage: string;
  title: string;
  onClose(): void;
  onConfirm(): void;
}

const b = block('confirmation-modal');

class ConfirmationModal extends React.PureComponent<IProps, {}> {
  public render() {
    const { isOpen, onClose, onConfirm, alertMessage, title } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        title={title}
        onClose={onClose}
      >
        <div className={b('content')}>
          {alertMessage}
        </div>
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={onClose}
          />
          <Button
            label="ОК"
            onClick={onConfirm}
            isPrimary
          />
        </div>
      </Modal>
    );
  }
}
export default ConfirmationModal;
