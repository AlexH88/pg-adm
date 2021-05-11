import * as React from 'react';
import {block} from 'bem-cn';
import {Link} from 'react-router-dom';
import {IModuleLink} from 'shared/types/app';
import './MenuItem.styl';
import ArrowIcon from './arrowIcon';

export interface IProps {
  link: string;
  title: string;
  icon?: string;
  categories?: IModuleLink[];
  turnedOff?: boolean;
}

export interface IState {
  showSubgroup: boolean;
}

const b = block('menu-item');

class MenuItem extends React.PureComponent<IProps, IState> {
  state = {
    showSubgroup: false
  };

  public componentDidMount() {
    const {
      title
    } = this.props;

    const lsData: any = localStorage.getItem('menuStatus');
    const oldStatus: any = JSON.parse(lsData);

    if (oldStatus !== null && oldStatus[title]) {
      this.setState({showSubgroup: true});
    }
  }

  handleMenuClick = (e: any) => {
    const {
      title,
      categories,
      turnedOff
    } = this.props;
    const {
      showSubgroup
    } = this.state;

    if ((categories && categories.length !== 0) || turnedOff) {
      e.preventDefault();
    }
    const lsData: any = localStorage.getItem('menuStatus');
    const newStatus = JSON.parse(lsData) === null ? {} : JSON.parse(lsData);
    newStatus[title] = !showSubgroup;

    this.setState({ showSubgroup: !showSubgroup });
    localStorage.setItem('menuStatus', JSON.stringify(newStatus));
  }

  public render(): JSX.Element {
    const {
      turnedOff,
      link,
      title,
      categories
    } = this.props;

    const {
      showSubgroup
    } = this.state;

    return (
      <div className={b('wrapper')}>
        <div className={b('link').mix(turnedOff ? 'turnedOff' : '')}>
          <Link
            onClick={this.handleMenuClick}
            to={link}
          >
            <span className={b('arrow', {expand: showSubgroup})}>
              {categories && categories.length > 0 && <ArrowIcon/>}
            </span>
            <span>{title}</span>
          </Link>
        </div>
        {!turnedOff && (
          <div className={b('subgroup', {expand: showSubgroup})}>
            {
              categories && categories.map((categorie, index) => {
                if (categorie.categories && categorie.categories.length > 0) {
                  return (
                    <MenuItem
                      {...categorie}
                      key={index}
                      link={`${link}/${categorie.link}`}
                    />
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className={b('link').mix(categorie.turnedOff ? 'turnedOff' : '')}
                    >
                      <Link
                        onClick={(e) => {
                          if(categorie.turnedOff) { e.preventDefault() }
                        }}
                        to={`${link}/${categorie.link}`}
                      >
                        {categorie.title}
                      </Link>
                    </div>
                  );
                }
              })
            }
          </div>
        )}
      </div>
    );
  }
}

export { MenuItem };
export default MenuItem;
