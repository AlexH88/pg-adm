import * as React from 'react';
import {block} from 'bem-cn';

import {Button} from 'shared/view/elements';

import './style.styl';

const b = block('control-buttons');

interface IOwnProps {
  onClickReport?(): void;
  onClickRegular(): void;
}

function ControlButtons({ onClickReport, onClickRegular }: IOwnProps): JSX.Element {
  return (
    <div className={b()}>
      {
        onClickReport ?
        <div className={b('button')}>
          <Button
            label="Отчет"
            onClick={onClickReport}
            isPrimary
          />
        </div>
        :
        null
      }
      <div className={b('button')}>
        <Button
          label="Сохранить в регулярные"
          type="submit"
          isPrimary
          onClick={onClickRegular}
        />
      </div>
    </div>
  );
}

export default ControlButtons;
