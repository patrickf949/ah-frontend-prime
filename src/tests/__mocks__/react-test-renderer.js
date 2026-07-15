const enzyme = require("./enzyme");

module.exports = {
  create(element) {
    const wrapper = enzyme.shallow(element);
    return {
      root: wrapper,
      toJSON() {
        return wrapper.toJSON();
      },
      update(nextElement) {
        wrapper.setElement(nextElement);
      },
      unmount() {}
    };
  }
};
