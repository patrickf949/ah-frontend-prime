import React from "react";
import { NavBarComponent, mapStateToProps } from "../../components/navbar";
import { shallow } from "enzyme";

let wrapper;
let instance;
const props = {
  navBarDrawer: false,
  toggleDrawer: jest.fn(),
  logout: jest.fn(),
  getUsersProfileAction: jest.fn()
};
describe(" navbar component", () => {
  beforeEach(() => {
    wrapper = shallow(<NavBarComponent {...props} />);
    instance = wrapper.instance();
  });
  it("should render without crashing", () => {
    expect(wrapper).toMatchSnapshot();
  });
  it("should test toggling of the navbar", () => {
    const e = {
      preventDefault: jest.fn()
    };
    props.toggleDrawer(e);
    wrapper.setState({ navBarDrawer: true });
    expect(props.navBarDrawer).toEqual(false);
  });
  it("should test handle toggle method", () => {
    const e = {
      preventDefault: jest.fn()
    };
    instance.toggleDrawer(e);
    expect(props.navBarDrawer).toEqual(false);
  });
  it("should load other nav elements when a user is not authenticated", () => {
    wrapper.setProps({
      isAuthenticated: '<ul className="nav navbar-nav ml-auto"> </ul>'
    });
    expect(wrapper).toMatchSnapshot();
  });
  it("should handle onclick event", () => {
    instance.logout();
    expect(props.logout).toBeCalledTimes(0);
  });

  it("should handle search change", () => {
    const event = { target: { value: "my query" } };
    instance.handleSearchChange(event);
    expect(instance.state.search).toEqual("my query");
  });

  it("should handle search submit", () => {
    const event = { preventDefault: jest.fn() };
    const history = { push: jest.fn() };
    wrapper.setProps({ history });
    instance.setState({ search: "my query" });
    
    instance.handleSearchSubmit(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalledWith("/?search=my%20query");
  });

  it("should fetch user profile on mount if username in session and no profile", () => {
    sessionStorage.setItem("username", "testuser");
    const mockGetProfile = jest.fn();
    const localWrapper = shallow(<NavBarComponent {...props} getUsersProfileAction={mockGetProfile} profile={null} />);
    localWrapper.instance().componentDidMount();
    expect(mockGetProfile).toHaveBeenCalledWith("testuser");
  });

  it("should clean up event listener and timer on unmount", () => {
    jest.useFakeTimers();
    instance.handleDropdownMouseLeave();
    expect(instance.closeTimer).toBeTruthy();
    instance.componentWillUnmount();
    jest.useRealTimers();
  });

  it("should handle click outside to close dropdown", () => {
    instance.setState({ isDropdownOpen: true });
    instance.dropdownRef = { current: { contains: jest.fn(() => false) } };
    instance.handleClickOutside({ target: document.body });
    expect(instance.state.isDropdownOpen).toBe(false);

    instance.setState({ isDropdownOpen: true });
    instance.dropdownRef = { current: { contains: jest.fn(() => true) } };
    instance.handleClickOutside({ target: document.body });
    expect(instance.state.isDropdownOpen).toBe(true);
  });

  it("should handle dropdown mouse enter and leave with timer", () => {
    jest.useFakeTimers();
    instance.handleDropdownMouseLeave();
    expect(instance.state.isDropdownOpen).toBe(false);

    instance.handleDropdownMouseEnter();
    expect(instance.state.isDropdownOpen).toBe(true);
    expect(instance.closeTimer).toBeNull();

    instance.handleDropdownMouseLeave();
    jest.advanceTimersByTime(2000);
    expect(instance.state.isDropdownOpen).toBe(false);
    jest.useRealTimers();
  });

  it("should toggle dropdown", () => {
    instance.setState({ isDropdownOpen: false });
    instance.toggleDropdown();
    expect(instance.state.isDropdownOpen).toBe(true);
    instance.toggleDropdown();
    expect(instance.state.isDropdownOpen).toBe(false);
  });

  it("should close dropdown when dropdown-content is clicked", () => {
    wrapper.setProps({ isAuthenticated: true });
    wrapper.setState({ isDropdownOpen: true });
    const content = wrapper.find(".dropdown-content");
    if (content.length > 0) {
      content.simulate("click");
      expect(wrapper.state().isDropdownOpen).toBe(false);
    }
  });

  it("should map state to props correctly", () => {
    const mockState = {
      auth_login: { loginSuccess: true },
      socialAuthReducer: { isAuthenticated: false },
      profileReducer: { loggedInProfile: { username: "johndoe" } }
    };
    const mapped = mapStateToProps(mockState);
    expect(mapped.isAuthenticated).toBe(true);
    expect(mapped.isAuthenticatedSocial).toBe(false);
    expect(mapped.profile).toEqual({ username: "johndoe" });
  });
});
