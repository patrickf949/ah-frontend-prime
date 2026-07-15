expect.extend({
  toBeCalled(received) {
    const pass = Boolean(received && received.mock && received.mock.calls.length);
    return {
      pass,
      message: () =>
        `expected mock function ${pass ? "not " : ""}to have been called`
    };
  },
  toBeCalledTimes(received, expected) {
    const actual = received && received.mock ? received.mock.calls.length : 0;
    const pass = actual === expected;
    return {
      pass,
      message: () =>
        `expected mock function to be called ${expected} times, received ${actual}`
    };
  },
  toBeCalledWith(received, ...expectedArgs) {
    const calls = received && received.mock ? received.mock.calls : [];
    const pass = calls.some(call => this.equals(call, expectedArgs));
    return {
      pass,
      message: () =>
        `expected mock function ${pass ? "not " : ""}to be called with ${this.utils.printExpected(
          expectedArgs
        )}`
    };
  }
});
