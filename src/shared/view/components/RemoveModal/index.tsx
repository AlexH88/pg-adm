import * as React from 'react';
import {block} from 'bem-cn';
import {Modal} from 'shared/view/components';
import {Button} from 'shared/view/elements';
import './style.styl';
import i18next from "i18next";

interface IProps {
  isOpen: boolean;
  alertMessage: string;
  onClose(): void;
  onRemove(): void;
  syncOff?: boolean;
  error?: string;
  planFloor?: boolean;
}

const b = block('remove-modal');

class RemoveModal extends React.PureComponent<IProps, {}> {
  public render() {
    const { isOpen, onClose, onRemove, alertMessage, syncOff, error, planFloor } = this.props;
    const titleComponent = (
      <span className={b('title')}>
        {i18next.t('RemoveModal.attention')}
        <span className={b('danger')} />
      </span>
    );

    let label = ""

    if (syncOff) {
      label = "Рассинхронизировать"
    } else if (planFloor) {
      label = "Да"
    } else {
      label = "Удалить"
    }

    return (
      <Modal
        isOpen={isOpen}
        title={titleComponent}
        onClose={onClose}
      >
        <div className={b('content')}>
          {alertMessage}
        </div>
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('RemoveModal.cancel')}
            onClick={onClose}
          />
          <Button
            // label={syncOff ? "Рассинхронизировать" : "Удалить"}
            label={label}
            onClick={onRemove}
            isPrimary
          />
        </div>
      </Modal>
    );
  }
}
export default RemoveModal;
