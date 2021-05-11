import * as React from 'react';
import {block} from 'bem-cn';
import {Modal} from 'shared/view/components';
import {Button} from 'shared/view/elements';
import './style.styl';

interface IProps {
  isOpen: boolean;
  alertMessage: string;
  onClose(): void;
  onSave(): void;
}

const b = block('save-modal');

class SaveModal extends React.PureComponent<IProps, {}> {
  public render() {
    const { isOpen, onClose, onSave, alertMessage } = this.props;
    const titleComponent = (
      <span className={b('title')}>
        Внимание
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
          <Button
            label="Отмена"
            onClick={onClose}
          />
          <Button
            label="Сохранить"
            onClick={onSave}
            isPrimary
          />
        </div>
      </Modal>
    );
  }
}
export default SaveModal;
