import {Action} from "redux";

interface IInjectedResource extends Action {
  meta?: {
    resource: string;
  };
  payload?: any;
}
function injectResource<R>(resource: string, actionCreator: Func0<R>): Func0<R>;
function injectResource<T1, R>(resource: string, actionCreator: Func1<T1, R>): Func1<T1, R>;
function injectResource<T1, T2, R>(resource: string, actionCreator: Func2<T1, T2, R>): Func2<T1, T2, R>;
function injectResource<T1, T2, T3, R>(resource: string, actionCreator: Func3<T1, T2, T3, R>): Func3<T1, T2, T3, R>;
function injectResource<T1, T2, T3, T4, R>(resource: string, actionCreator: Func4<T1, T2, T3, T4>): Func4<T1, T2, T3, T4>;

function injectResource(resource: string, actionCreator: Function) {
  const actionCreatorWithResource: any = (...arg: any[]) => {
    const action = actionCreator(...arg);
    return {
      ...action,
      meta: {
        resource,
      },
    };
  };
  return actionCreatorWithResource;
}
// injectResource<number, number>('', (arg: number) => arg );

export { IInjectedResource };
export default injectResource;
