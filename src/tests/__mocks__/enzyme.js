const React = require("react");

const isClassComponent = type =>
  Boolean(type && type.prototype && type.prototype.render);

const isHookBoundary = type => {
  const name = (type && (type.displayName || type.name)) || "";
  return ["Provider", "BrowserRouter", "HashRouter", "MemoryRouter"].includes(name);
};

const getChildren = node => {
  if (!node || !node.props) return [];
  return React.Children.toArray(node.props.children);
};

const classNames = value => String(value || "").split(/\s+/).filter(Boolean);

const matchesSelector = (node, selector) => {
  if (!node || typeof node !== "object") return false;
  if (typeof selector === "string") {
    if (selector.startsWith("#")) return node.props && node.props.id === selector.slice(1);
    if (selector.startsWith(".")) {
      return node.props && classNames(node.props.className).includes(selector.slice(1));
    }
    const typeName = (node.type && (node.type.displayName || node.type.name)) || "";
    if (typeName === selector || typeName === `Mui${selector}` || typeName.endsWith(selector)) return true;
  }
  return node.type === selector;
};

const walk = (node, selector, matches = []) => {
  if (Array.isArray(node)) {
    node.forEach(child => walk(child, selector, matches));
    return matches;
  }
  if (!node || typeof node !== "object") return matches;
  if (matchesSelector(node, selector)) matches.push(node);
  getChildren(node).forEach(child => walk(child, selector, matches));
  return matches;
};

const propNameForEvent = eventName =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

class Wrapper {
  constructor(element, nodes) {
    this.nodes = nodes || null;
    this.setElement(element);
  }

  setElement(element) {
    this.element = element;
    this._instance = null;
    this._render();
    return this;
  }

  _render() {
    if (this.nodes) {
      this.output = this.nodes;
      return;
    }

    const { type, props = {} } = this.element || {};
    if (isClassComponent(type)) {
      if (!this._instance) {
        this._instance = new type(props);
        this._instance.props = props;
        this._instance.setState = (nextState, callback) => {
          const patch =
            typeof nextState === "function"
              ? nextState(this._instance.state, this._instance.props)
              : nextState;
          this._instance.state = {
            ...(this._instance.state || {}),
            ...(patch || {})
          };
          this.output = this._instance.render();
          if (typeof callback === "function") {
            callback.call(this._instance);
          }
        };
        if (this._instance.componentWillMount) {
          this._instance.componentWillMount();
        }
      }
      this.output = this._instance.render();
      return;
    }

    if (typeof type === "function") {
      if (isHookBoundary(type)) {
        this.output = this.element;
        return;
      }

      try {
        this.output = type(props);
      } catch (error) {
        // Hook-based components (e.g. react-redux Provider) cannot be
        // invoked outside a real renderer; represent them shallowly.
        this.output = this.element;
      }
      return;
    }

    this.output = this.element;
  }

  instance() {
    return this._instance;
  }

  setProps(nextProps) {
    const props = { ...(this.element.props || {}), ...(nextProps || {}) };
    if (this._instance) {
      if (this._instance.componentWillReceiveProps) {
        this._instance.componentWillReceiveProps(props);
      }
      if (this._instance.UNSAFE_componentWillReceiveProps) {
        this._instance.UNSAFE_componentWillReceiveProps(props);
      }
      this._instance.props = props;
      this.element = { ...this.element, props };
      this.output = this._instance.render();
    } else {
      this.element = { ...this.element, props };
      this._render();
    }
    return this;
  }

  setState(nextState, callback) {
    if (this._instance && this._instance.setState) {
      this._instance.setState(nextState, callback);
    }
    return this;
  }

  find(selector) {
    return new Wrapper(null, walk(this.output, selector));
  }

  dive() {
    return this;
  }

  at(index) {
    return new Wrapper(null, this.nodes ? [this.nodes[index]].filter(Boolean) : []);
  }

  simulate(eventName, event) {
    const node = this.nodes ? this.nodes[0] : this.output;
    const handler = node && node.props && node.props[propNameForEvent(eventName)];
    if (typeof handler === "function") {
      handler(event || { preventDefault() {} });
    }
    return this;
  }

  props() {
    const node = this.nodes ? this.nodes[0] : this.output;
    return (node && node.props) || {};
  }

  state() {
    return this._instance ? this._instance.state : undefined;
  }

  exists() {
    return this.length > 0;
  }

  text() {
    const collect = node => {
      if (node == null || typeof node === "boolean") return "";
      if (typeof node === "string" || typeof node === "number") return String(node);
      return getChildren(node).map(collect).join("");
    };
    return (this.nodes || [this.output]).map(collect).join("");
  }

  toJSON() {
    return this.nodes || this.output;
  }

  get length() {
    return this.nodes ? this.nodes.length : this.output ? 1 : 0;
  }
}

const shallow = element => new Wrapper(element);
const mount = element => new Wrapper(element);
const configure = () => {};

module.exports = { shallow, mount, configure };
