// Global definitions (you shouldn't import it, it is global scope)
/* tslint:disable */
interface Window {
  __REDUX_DEVTOOLS_EXTENSION__?: Function;
}

interface SinonStub {
  callsFake: Function;
}

declare module 'decko';
declare module 'bem-cn';
declare module 'reselect';
declare module 'crypto-js';
declare module 'sockjs-client';
declare module 'react-sortable-hoc';
declare module 'react-currency-input';
declare module '*.ico';
declare module '*.png';
declare module '*.styl';
declare module '*.woff2';
declare module '*.svg' {
  const svgImages: any;
  export = svgImages;
}

type Func0<R>= () => R;
type Func1<T1, R> = (arg1: T1) => R;
type Func2<T1, T2, R> = (arg1: T1, arg2: T2) => R;
type Func3<T1, T2, T3, R> = (arg1: T1, arg2: T2, arg3: T3) => any;
type Func4<T1, T2, T3, T4> = (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => any;
type Func5<T1, T2, T3, T4, T5> = (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => any;
type FuncRest = (...args: any[]) => any;
