import * as React from 'react';
import {bindActionCreators} from 'redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import {IAgregate} from '../../namespace';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {JobFormatConfigs} from '../../configs';
import injectResource from 'shared/helpers/injectResource';
import {formatDateTime} from 'shared/helpers/formatData';
import './index.styl';
import {Gallery} from "./Gallery/index";
import {getImages} from 'features/showResource/redux/actions/communication';
import i18next from "i18next";

const resource = 'jobs';

interface IResourceReduxState {
    currentOperator?: any;
    gallery?: any;
}

interface IStateProps {
    headers: FilterResourseNS.IHeader[];
    configHeaders: IConfigHeaders;
    configAggregates: IAgregate[];
    currentOperator: any;
    gallery: any;
}

interface IDispatchProps {
    getImages: typeof getImages;
}

interface IState {
    showGallery: boolean;
    currentImages: any;
}

function mapStateToProps(state: IReduxState): IStateProps {
    const {
        [resource]: {
            currentOperator = {},
            gallery = {},
        } = {}
    }: {
        [resource: string]: IResourceReduxState;
    } = state.showResource;

    return {
        currentOperator: currentOperator.access_rules,
        headers: ShowResourceSelectors.getHeaders(state, resource),
        configHeaders: getHeadersConfig(resource, state),
        configAggregates: getAggregates(resource, state),
        gallery
    };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
    return bindActionCreators({
        getImages: injectResource(resource, getImages)
    }, dispatch);
}

const drawZero = (date: number) => (
    date > 9 ? `${date}` : `0${date}`
);

class Jobs extends React.PureComponent<IDispatchProps & IStateProps, IState> {
    private b = block(resource);

    constructor(props: IDispatchProps & IStateProps) {
        super(props);
        this.state = {
            showGallery: false,
            currentImages: {}
        }
    }

    public render() {
        const {headers, configHeaders, configAggregates, getImages, gallery} = this.props;
        const {showGallery, currentImages} = this.state;
        return (
            <div className={this.b()}>
                <FilterResource
                    configs={configHeaders}
                    resource={resource}
                    label={i18next.t('Jobs.Journal')}
                />
                <ShowResource
                    resource={resource}
                    headers={headers}
                    configs={{
                        sort: {
                            by: 'id',
                            order: 'desc',
                        },
                    }}
                    aggregateStats={configAggregates}
                    headersFormatter={this.renderLoginsFormatter}
                    configHeadersTable={configHeaders}
                />
                {
                    showGallery && (
                        <Gallery
                            isShow={showGallery}
                            onClose={this.onCloseGallery}
                            settings={currentImages}
                            getImages={getImages}
                            gallery={gallery}
                        />
                    )
                }
            </div>
        );
    }

    @bind
    private onCloseGallery() {
        this.setState({
            showGallery: false,
            currentImages: this.state.currentImages,
        })
    }

    @bind
    private onOpenGallery(row: IResource) {
        this.setState({
            showGallery: true,
            currentImages: {
                id: row.id,
                pages: row.pages
            },
        })
    }

    @bind
    private renderLoginsFormatter(field: any, row: IResource & any) {
        const {
            user,
            printer
        } = row;

        if (JobFormatConfigs[field] && JobFormatConfigs[field][row[field]]) {
            const formatObject = JobFormatConfigs[field][row[field]];
            return <span style={{color: formatObject['color']}}>{formatObject['label']}</span>;
        }
        if (field === 'login') {
            if (user.ldapSource) {
                return `${user.ldapSource.name}\\${user.login}`;
            } else {
                return user.catalogs.name ? `${user.catalogs.name}\\${user.login}` : user.login;
            }
            // return `${user.catalogs.name}/${user.login}`;
        }
        if (field === 'catalogName') {
            if (user.catalogs) {
                return `${user.catalogs.name}`;
            } else {
                return null
            }

            // return `${user.catalogs.name}`;
        }
        if (field === 'duplex') {
            return row[field] ? `${i18next.t('Jobs.Yes')}` : `${i18next.t('Jobs.Not')}`;
        }

        function formatCurrencyForTable(currencyValue: string) { // TODO to utils
            return `${Number(currencyValue) / 100}`;
        }

        if (field === 'price') {
            return formatCurrencyForTable(row[field]);
        }
        if (field === 'title') {
            return row.isBackup === true ?
                <a
                    className="link-cell-active"
                    href="#"
                    onClick={this.onOpenGallery.bind(this, row)}
                >
                    {row[field]}
                </a>
                :
                <a className="link-cell">
                    {row[field]}
                </a>
        }
        if (field === 'color') {
            return !row[field] ? `${i18next.t('Jobs.cb')}` : `${i18next.t('Jobs.Color')}`;
        }
        if (field === 'printer') {
            return `${printer.name}`;
        }
        if (field === 'host') {
            return `${printer.host.name}`;
        }
        if ((field === 'outputTime' || field === 'inputTime') && row[field]) {
            /*
                  const date = new Date();
                  if (row[field] && Array.isArray(row[field]) && row[field].length === 7) {
                    date.setUTCFullYear(row[field][0]);
                    date.setUTCMonth(row[field][1]);
                    date.setUTCDate(row[field][2]);
                    date.setUTCHours(row[field][3]);
                    date.setUTCMinutes(row[field][4]);
                    date.setUTCSeconds(row[field][5]);
                    //date.setMilliseconds(row[field][6]);
                  }
                  return `${drawZero(date.getHours())}:${drawZero(date.getMinutes())}:${drawZero(date.getSeconds())} ` +
                    `${drawZero(date.getDate())}.${drawZero(date.getMonth()+1)}.${date.getFullYear()}`;
            */
            return formatDateTime(row[field])
        }
        if (field === 'status') {
            switch (row[field]) {
                case 'DENY_LICENSE':
                    return 'Отказ';
                case 'DENY_BALANCE':
                    return 'Отказ';
                case 'DENY_TIME_POLICY':
                    return 'Отказ';
                case 'DENY_RESTRICTION_POLICY':
                    return 'Отказ';
                case 'PRINTED':
                    return 'Распечатано';
                case 'PDF_DOWNLOAD':
                    return 'Печатается';
                case 'MODIFIED_SPL_DOWNLOAD':
                    return 'Загрузка SPL';
                case 'PRINT_DATA':
                    return 'Обрабатывается';
                case 'PRINT_FORCE':
                    return 'Печатается';
                case 'DECLINED':
                    return 'Отменена';
                case 'INIT':
                    return 'Обрабатывается';
                case 'ERROR':
                    return 'Ошибка';
                case 'QUEUE':
                    return 'В очереди';
                default:
                    console.log('Unknown status: ' + row[field]);
            }
        }
        if (field === 'details') {
            switch (row['status']) {
                case 'DENY_BALANCE':
                    return 'Нет средств';
                case 'DENY_LICENSE':
                    return 'Истекла лицензия';
                case 'DENY_TIME_POLICY':
                    return 'Правило по времени';
                case 'DENY_RESTRICTION_POLICY':
                    return 'Правило по доступу';
                case 'ERROR':
                    return 'Ошибка';
                default:
                    console.log('Unknown status: ' + row[field]);
            }
        }
        return row[field];
    }

}

export {Jobs};
export default connect<IStateProps, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Jobs);
