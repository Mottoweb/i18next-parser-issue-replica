global.requestAnimationFrame = function requestAnimationFrame(callback) {
  setTimeout(callback, 0);
};

/**
 * @link https://jestjs.io/docs/en/expect#tothrowerror
 * Note: You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
 */
global.throwFunctionFactory = function throwFunctionFactory() {
  const callFunc = arguments[0]; // eslint-disable-line prefer-rest-params
  const props = Array.prototype.slice.call(arguments, 1); // eslint-disable-line prefer-rest-params

  return function resultFunc() {
    callFunc.apply(this, props);
  };
};

global.translate = (text) => text;
