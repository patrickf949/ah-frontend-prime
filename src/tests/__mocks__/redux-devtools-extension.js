// CommonJS stand-in for @redux-devtools/extension, which ships ESM that
// jest does not transform from node_modules.
const { compose } = require("redux");

const composeWithDevTools = (...args) => {
  if (args.length === 1 && typeof args[0] !== "function") {
    return compose;
  }
  return compose(...args);
};

module.exports = {
  composeWithDevTools,
  devToolsEnhancer: () => enhancer => enhancer
};
