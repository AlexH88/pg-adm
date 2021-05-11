import * as React from 'react';
import uploadIcon from './images/upload-icon.png'
import './style.styl';

interface IOwnProps {
  onClick?: any;
  title?: string;
  id?: string;
}

class LoadFileIcon extends React.Component<IOwnProps, {}> {
  public render() {
    const { onClick, title, id } = this.props;
    return (
		<div className='load-icon'
	        onClick={onClick}
	        title={title ? title : null}
	        id={id ? id : null}
		>
			<label htmlFor="file-input">
				<img src={uploadIcon}/>
			</label>
		</div>
    );
  }
}

export default LoadFileIcon;