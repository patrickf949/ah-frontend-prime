const thunk = ({ dispatch, getState }) => next => action =>
  typeof action === "function" ? action(dispatch, getState) : next(action);

module.exports = thunk;
module.exports.default = thunk;
module.exports.thunk = thunk;
