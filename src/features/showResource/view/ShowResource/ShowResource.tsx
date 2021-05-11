import * as React from 'react';
import { block } from 'bem-cn';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { bind } from 'decko';
import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { IReduxState, IResource, TypesResources } from 'shared/types/app';
import { Aggregate, Table, TableHeader } from 'shared/view/components';
import { Checkbox, IconButton, LoadFileIcon } from 'shared/view/elements';
import injectResource from 'shared/helpers/injectResource';
import { address } from 'shared/api/HttpActions';
import { actions } from '../../redux';
import { initialResource } from '../../redux/data/initial';
import { IAggregate, IHeader, IResourceReduxState, ISort } from '../../namespace';
import './ShowResource.styl';
import AddIcon from './addIcon';
import MultiEditIcon from './multiEditIcon';
import SyncIcon from './syncIcon';
import i18next from "i18next";

interface IState {
  buttonPressed: boolean;
  headersInitialised: boolean;
  widthTable: any;
}

interface IDispatchProps {
  initResource: typeof actions.initResource;
  loadResource: typeof actions.loadResource;
  loadRoleResource: typeof actions.loadResource;
  loadUserGroupsResource: typeof actions.loadShortResource;
  loadPrinterGroupsResource: typeof actions.loadShortResource;
  loadRecursiveResource: typeof actions.loadRecursiveResource;
  stopLoadRecursiveResource: typeof actions.stopLoadRecursiveResource;
  sortResource: typeof actions.sortResource;
  changePage: typeof actions.changePage;
  loadPolicyRule: typeof actions.loadPolicyRule;
  changeOrderItems: typeof actions.changeOrderItems;
  initHeadersConfig: typeof actions.initHeadersConfig;
  changeLoader: typeof actions.changeLoader;
  putTimerId: typeof actions.putTimerId;
  updateIndividualResourceItem: typeof actions.updateIndividualResourceItem;
  updateTableReloadPrompt: typeof actions.updateTableReloadPrompt;
}

interface IStateProps {
  currentOperator: any;
  data: IResource[][];
  prompt: any;
  sort: ISort;
  aggregate: IAggregate;
  pages: number;
  currentPage: number;
  isLoading: boolean;
  headers: IHeader[];
  connectedHeaders: IHeader[];
}

interface IOwnProps {
  resource: TypesResources;
  configs: Partial<IResourceReduxState>;
  configHeadersTable: Partial<IResourceReduxState>;
  headers: Array<{ value: string; title: string; isSortable?: boolean }>;
  title?: string;
  aggregateStats?: Array<{ value: string, title: string }>;
  headersFormatter?: <IResource>(field: string, row: IResource) => JSX.Element | string | number | boolean | null;
  actionsFormatter?: <IResource>(field: string, row: IResource) => JSX.Element | null;
  onAdd?: any;
  onEditTemplate?: any;
  onMultiedit?: () => void;
  onLoadFile?: any;
  isAllSelected?: boolean;
  isMultiEdit?: boolean;
  actionsHeader?: JSX.Element | null;
  policyId?: number;
  pullingData?: boolean;
  isNotPagination?: boolean;
  onAllItemsSelect?: () => void;
  label?: string;
  onSynchronize?: () => void;
  iconModalDisabled?: boolean;
  onReport?: any;
  donwloadDisabled?: boolean;
}

function mapStateToProps(state: IReduxState, ownProps: IOwnProps): IStateProps {
  const resourceState = state.showResource[ownProps.resource];
  const {
    data,
    prompt,
    pages,
    isLoading,
    sort,
    aggregate,
    currentPage,
    headers,
    currentOperator
  } = resourceState || initialResource;

  let connectedHeaders: any;
  if (ownProps.resource === 'snmp') {
    connectedHeaders = headers;
  } else if (headers) {
    connectedHeaders = headers.filter((header) => header.isConnected);
  } else {
    connectedHeaders = [];
  }

  return {
    currentOperator,
    data: data as IResource[][],
    prompt,
    sort,
    pages,
    aggregate,
    currentPage,
    isLoading,
    headers,
    connectedHeaders
  };
}

function mapDispatchToProps(dispatch: any, ownProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    changeHeader: injectResource(ownProps.resource, actions.changeHeader),
    changeLoader: injectResource(ownProps.resource, actions.changeLoader),
    changeOrderItems: injectResource(ownProps.resource, actions.changeOrderItems),
    changePage: injectResource(ownProps.resource, actions.changePage),
    initHeadersConfig: injectResource(ownProps.resource, actions.initHeadersConfig),
    initResource: injectResource(ownProps.resource, actions.initResource),
    loadPolicyRule: injectResource(ownProps.resource, actions.loadPolicyRule),
    loadRecursiveResource: injectResource(ownProps.resource, actions.loadRecursiveResource),
    loadResource: injectResource(ownProps.resource, actions.loadResource),
    loadRoleResource: injectResource('roles', actions.loadResource),
    loadUserGroupsResource: injectResource('usergroups', actions.loadShortResource),
    loadPrinterGroupsResource: injectResource('printergroups', actions.loadShortResource),
    putTimerId: injectResource(ownProps.resource, actions.putTimerId),
    sortResource: injectResource(ownProps.resource, actions.sortResource),
    stopLoadRecursiveResource: injectResource(ownProps.resource, actions.stopLoadRecursiveResource),
    updateIndividualResourceItem: injectResource(ownProps.resource, actions.updateIndividualResourceItem),
    updateTableReloadPrompt: injectResource(ownProps.resource, actions.updateTableReloadPrompt)
  }, dispatch);
}

function fixTable() {
  const cellMinWidth = 100;
  let blockResource: any = document.querySelector('.show-resource');
  const tableWidth = blockResource.clientWidth < 1180 ? '120vh' : '100%'
  let header: any = document.querySelector('.data-table__header');
  let rows: any = document.querySelectorAll('.data-table__row');
  let body: any = document.querySelector('.data-table__body');

  if (body && header) {
    body.addEventListener('scroll', () => {
      header.scrollLeft = body.scrollLeft;
    });

    if (body.scrollHeight > body.offsetHeight) {
      header.classList.add('header-margin-right');
    } else {
      header.classList.remove('header-margin-right');
    }
  }

  if (rows) {
    const cell: any = rows[0].children[0];
    const cellComputedStyle: any = getComputedStyle(cell);
    const paddingLeft = parseInt(cellComputedStyle.paddingLeft, 10);
    const paddingRight = parseInt(cellComputedStyle.paddingRight, 10);

    if (cell.offsetWidth - paddingLeft + paddingRight > cellMinWidth) {
      for (const row of rows) {
//        row.style.width = tableWidth;
        row.style.minWidth = '100%';
      }
    }

  }
}

function getIdForItem(resource){
  return `${resource}--${Math.random().toString(36).substr(2, 5)}`
}

type Props = IDispatchProps & IStateProps & IOwnProps;

const b = block('show-resource');

class ShowResource extends React.PureComponent<Props, IState > {
  public state: IState = {
    buttonPressed: false,
    headersInitialised: false,
    widthTable: null
  };

  private stompClient: Client;

  handleResize = () => {
    let blockResource: any = document.querySelector('.show-resource');
    let widthTable = blockResource.scrollWidth - blockResource.clientLeft

    this.setState({
      widthTable: window.innerWidth - 310
    })
  }

  public componentDidUpdate() {
    const { headersInitialised } = this.state;
    const { configHeadersTable, initHeadersConfig } = this.props;
    if (location.pathname !== '/login') {
      setTimeout(() => {
        fixTable()
      }, 0);
      if (
        !headersInitialised
        && configHeadersTable
        && configHeadersTable.headers
        && configHeadersTable.headers.length
      ) {
        initHeadersConfig(configHeadersTable);
        this.setState({headersInitialised: true});
      }
    }
  }

  public componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)

    const {
      initResource,
      configs,
      resource,
      loadResource,
      loadRoleResource,
      loadUserGroupsResource,
      loadPrinterGroupsResource,
      pullingData
    } = this.props;

    initResource(configs);
    if (pullingData) {
      loadResource(false, false);
    } else if (resource === 'operators') {
      loadRoleResource(false, false);
      loadResource(false, false);
    } else if (['time_policy', 'backup_policy', 'restriction_policy', 'watermark_policy'].includes(resource)) {
      loadUserGroupsResource(null);
      loadPrinterGroupsResource(null);
      loadResource(false, false);
    } else {
      loadResource(false, false);
    }

    const resources: string[] = ['hosts-network', 'hosts-local', 'jobs', 'printers-local', 'printers-network'];

    if (resources.includes(resource)) {
      let endpoint: string = resource;

      if (resource.includes('hosts')) {
        endpoint = 'hosts';
      }
      if (resource.includes('printers')) {
        endpoint = 'printers';
      }

      this.stompClient = new Client();
      this.stompClient.configure({
        connectHeaders: {
          login: 'frontend'
        },
        webSocketFactory: () => new SockJS(`${address}/frontend-endpoint`),
        onConnect: () => {
          this.stompClient.subscribe(`/queue/frontend/${endpoint}`, ({body}) => {

            if (body === 'RELOAD') {
              loadResource(false, false);
            } else {
              const data = JSON.parse(body);

              if (endpoint === 'hosts' || endpoint === 'printers') {
                if (resource.includes(data.hostType)) {
                  this.updateResourceItem(data);
                }
              } else {
                this.updateResourceItem(data);
              }
            }
          })
        },
        onWebSocketClose: () => console.log('onWebSocketClose'),
      });

      this.stompClient.activate();
    }
  };

  public componentWillUnmount() {
    const { pullingData, stopLoadRecursiveResource } = this.props;
    if (pullingData) {
      stopLoadRecursiveResource();
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
    }

    window.removeEventListener('resize', this.handleResize)
  }

  public render() {
    const {
      isLoading,
      sortResource,
      sort,
      currentPage,
      connectedHeaders,
      resource,
      pages,
      headersFormatter,
      onAllItemsSelect,
      isAllSelected,
      actionsFormatter,
      aggregateStats,
      headers,
      onAdd,
      onEditTemplate,
      onMultiedit,
      onLoadFile,
      isMultiEdit,
      actionsHeader,
      changeOrderItems,
      prompt,
      loadResource,
      onSynchronize,
      iconModalDisabled,
      onReport,
      donwloadDisabled,
    } = this.props;

    let {data} = this.props;

    if(resource == 'roles') {
      if((!data.length) && (data[0])) {
        let temp = []
        data[0].forEach((item) => {
          let strAuthorities = ''
          if(item.authorities.length > 0) {
            item.authorities.forEach((el) => {
              strAuthorities += el.description + ' '
            })
          }
          let objTemp:any = {}
          objTemp.id = item.id
          objTemp.name = item.name
          objTemp.description = item.description
          objTemp.authorities = strAuthorities
          temp.push(objTemp)
        })
        data = temp;
      }
    }

    const extraFields = this.props.isMultiEdit
      ? [{ value: 'checkbox', title: '', isConnected: this.props.isMultiEdit, isSortable: false }]
      : [];

    if(connectedHeaders.length <= 6) {
      connectedHeaders.unshift(...extraFields);
    }

    const headersComponents = connectedHeaders.map((header, index) => {
      if(header.title === '') {
         return (
          <TableHeader
            key={index}
            dataField={header.value}
            formatter={headersFormatter}
          >
            <>{actionsHeader}</>
          </TableHeader>
        )
      } else {
         return (
          <TableHeader
            key={index}
            autoWidth={index === 0 && isMultiEdit}
            dataField={header.value}
            isSortable={header.isSortable}
            formatter={headersFormatter}
          >
            {header.title}
          </TableHeader>
        )
      }

    });

    let styleSyncBtnDis = {
      backgroundColor: '#c7c8ce',
      color: '#ecedf1',
      boxShadow: 'none',
      cursor: 'default'
    }

    if (headers) {
      return (
        <div>
          <div className={b()} style={{width: this.state.widthTable}}>
            {(onAdd || isMultiEdit || onEditTemplate) && (
              <section className={b('controls')}>
                {onAdd && (
                  <div className={b('icon-btn-wrapper')}>
                    <IconButton
                      onClick={onAdd}
                      icon={ resource !== 'integration' ? <AddIcon/> : <SyncIcon/> }
                      title="Добавить"
                      id={getIdForItem(resource)}
                      isPrimary
                    />
                  </div>
                )}
                {onEditTemplate && (
                  <div
                    onClick={onEditTemplate}
                    className={b('edit-template-btn', { pressed: isMultiEdit })}
                    id={getIdForItem(resource)}
                  >
                    Редактировать основной шаблон
                  </div>
                )}
                {onMultiedit && (
                  <div className={b('icon-btn-wrapper')}>
                    <IconButton
                      onClick={onMultiedit}
                      icon={<MultiEditIcon/>}
                      title="Множественное редактирование"
                      id={getIdForItem(resource)}
                      isPrimary
                    />
                  </div>
                )}
                {onLoadFile && (
                  <div className={b('icon-btn-wrapper')}>
                    <LoadFileIcon 
                      onClick={onLoadFile}
                      title="Обновить карты"
                      id={getIdForItem(`${resource}-card`)}
                    />
                  </div>
                )}
                {resource === 'users' && (
                  <div className={b('icon-btn-wrapper')}>
                    <IconButton
                      style={ iconModalDisabled ? styleSyncBtnDis : null }
                      onClick={onSynchronize}
                      icon={<SyncIcon/>}
                      title="Синхронизировать из каталога"
                      id={getIdForItem(resource)}
                      disabled={iconModalDisabled}
                      isPrimary
                    />
                  </div>
                )}
              </section>
            )}
            <Table
              isLoading={isLoading}
              pages={pages}
              currentPage={currentPage}
              onChangePage={this.changePage}
              data={data}
              prompt={prompt}
              handleTableRefresh={() => loadResource(false, false)}
              onSort={sortResource}
              sort={sort}
              changeOrderItems={changeOrderItems}
              extraHeaderContent={null}
            >
              {
                actionsFormatter
                  ? [
                      ...headersComponents,
                      (
                        <TableHeader
                          key={headers.length}
                          dataField="actions"
                          align="right"
                          formatter={actionsFormatter}
                        >
                          {actionsHeader}
                        </TableHeader>
                      ),
                    ]
                  : headersComponents
              }
            </Table>
            {
              aggregateStats
                ? <Aggregate stats={aggregateStats.map(this.parseAggregateStat)} />
                : null
            }
            {
              onReport
              ? <div className="footer-btn">
                  <div
                    onClick={onReport}
                    className={ donwloadDisabled ? b('edit-template-btn', { pressed: isMultiEdit }) : b('edit-template-btn disabled', { pressed: isMultiEdit }) }
                    id={getIdForItem(resource)}
                  >
                    Скачать отчет
                  </div>
                </div>
              : null
            }
          </div>
        </div>
      );
    }

    return null;
  }

  @bind
  private parseAggregateStat({value, title}: {value: string, title: string}) {
    const aggregate = this.props.aggregate || {};
    return { value: aggregate[value], title };
  }

  @bind
  private changePage(page: number) {
    const { loadResource, changePage } = this.props;
    changePage(page);
    loadResource(false, false);
  }

  @bind
  private updateResourceItem(value: any) {
    const {
      sort,
      data,
      updateIndividualResourceItem,
      updateTableReloadPrompt,
      loadResource,
      resource
    } = this.props;

    if (data && data[0] && data[0].map(item => item.id).includes(value.id)) {
      updateIndividualResourceItem(value, sort);
    } else {
      if (['hosts-network', 'hosts-local', 'printers-network', 'printers-local'].includes(resource)) {
        loadResource(false, false);
      } else {
        updateTableReloadPrompt(value);
      }
    }
  }
}

export { ShowResource };
export default connect<IStateProps, IDispatchProps, IOwnProps >(mapStateToProps, mapDispatchToProps)(ShowResource);