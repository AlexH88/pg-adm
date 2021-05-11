const debounce = (fn: any, time: number) => {
  var timeout: any;

  return function(...args: any[]) {
    const functionCall = () => fn.apply(this, args);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}

export default debounce;
