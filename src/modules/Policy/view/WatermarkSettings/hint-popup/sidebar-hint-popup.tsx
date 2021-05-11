import React, {FC, ReactElement} from 'react';
import * as style from './style.styl';

interface OwnProps {
  message: string;
}

const SidebarHintPopup: FC<OwnProps> = ({
  message,
}: OwnProps): ReactElement<HTMLDivElement> => (
  <div
    className={style['form-hint__block']}
    style={{
      opacity: message ? 1 : 0,
      left: message ? '-81%' : '-100%',
      visibility: message ? 'visible' : 'hidden',
    }}
  >
    <div className={style['sidebar-hint__arrow-wrapper']}>
      <div className={style['sidebar-hint__arrow-body']} />
    </div>
    <span>{message}</span>
  </div>
);

export default SidebarHintPopup;
