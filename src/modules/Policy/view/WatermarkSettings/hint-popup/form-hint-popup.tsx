import React, {CSSProperties, FC, ReactElement} from 'react';
import * as classes from './style.styl';

interface OwnProps {
  message: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  style?: CSSProperties;
}

const FormHintPopup: FC<OwnProps> = ({
  message,
  position = 'left',
  style = {},
}): ReactElement<HTMLDivElement> => {
  const styles: CSSProperties = style;
  if (message) {
    styles.display = 'flex';
  }

  return (
    <div
      className={`${classes['form-hint__block']} ${classes[`form-hint__block--${position}`]}`}
      style={styles}
    >
      <div className={`${classes['form-hint__arrow-wrapper']} ${classes[`form-hint__arrow-wrapper--${position}`]}`}>
        {/* TODO add possibility set position of form hint popup */}
        <div className={`${classes['form-hint__arrow-body']} ${classes[`form-hint__arrow-body--${position}`]}`} />
      </div>
      {message}
    </div>
  );
};

export default FormHintPopup;
