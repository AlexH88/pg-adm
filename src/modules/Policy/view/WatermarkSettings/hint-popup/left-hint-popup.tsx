import * as React from 'react';
import * as style from './style.styl';

interface OwnProps {
  message: any;
}

const LeftHintPopup: React.SFC<OwnProps> = ({ message }) => (
  <div
    className={style['form-hint__block']}
    style={{
      opacity: message ? 1 : 0,
      left: message ? '-48%' : '-60%',
      visibility: message ? 'visible' : 'hidden',
    }}
  >
    <div className={style['sidebar-hint__arrow-wrapper']}>
      <div className={style['sidebar-hint__arrow-body']} />
    </div>
    {message}
  </div>
);

export default LeftHintPopup;
