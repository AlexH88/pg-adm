import * as React from 'react';
import {block} from 'bem-cn';
import './pagination.styl';

interface IProps {
  items: any;
  onClick(index: any): void;
}

const b = block('pagination');

class Pagination extends React.PureComponent<IProps> {
/*
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }
*/
  state = { activeIndex: 0 };

  public handleClick(index) {
  	const {onClick} = this.props;
    this.setState({ activeIndex: index });
    onClick(index);
  }

  public render() {
    const { items } = this.props;
    return (
		<div className={b('container')}>
			{
				items.map((item, index) => {
					const className = this.state.activeIndex === index ? 'active' : '';
					return(
						<span
						 key={index}
						 className={className}
						 onClick={this.handleClick.bind(this, index)}
						>
						 {index+1}
						</span>
					)
				})
			}
		</div>

    );
  }
}
export default Pagination;