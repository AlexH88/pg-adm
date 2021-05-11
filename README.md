# react-redux-starter-kit
Modular starter kit for React+Redux+React Router projects.

## To start localy
```npm run dev``` for development purposes in watch mode

## To build localy
```npm run build``` for development purposes without watch mode (see build folder)

## Features
- [x] Typescript 3.5.2
- [x] React 16.8.6
- [x] React-router 4
- [x] Redux
- [x] Redux-saga for side-effects
- [x] Stylus
- [x] BEM methodology
- [x] Webpack 4.3.2
- [x] Tests (karma, mocha, chai, sinon)
- [ ] Code splitting (async chunks loading)
- [ ] Code coverage (Istanbul) - temporary disabled (waiting for Phantom es6 support or typescript compiler generators support for es5 target)
- [ ] Hot reload
- [ ] Isomorphic
- [ ] ~100% tests coverage

## Запуск под Windows

1) ```SET TS_NODE_COMPILER_OPTIONS={"target": "es5", "module": "commonjs"}```

2) ```npm run dev-windows```

