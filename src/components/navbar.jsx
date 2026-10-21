import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { InputAdornment, TextField } from "@mui/material";
import { withRouter } from "../utils/router";
import "../styles/navbar.scss";
import BellIcon from "../styles/images/icons8-bell-100.png";
import SideDrawer from "./sideDrawer";
import profileImage from "../styles/images/profile.png";
import { getUsersProfileAction } from "../actions/profileActions";

export class NavBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navBarDrawer: false,
      search: "",
      isDropdownOpen: false
    };
    this.closeTimer = null;
    this.dropdownRef = React.createRef();
    this.logout = this.logout.bind(this);
  }
  
  componentDidMount() {
    const sessionUser = sessionStorage.getItem("username");
    if (sessionUser && !this.props.profile) {
      this.props.getUsersProfileAction(sessionUser);
    }
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }

  handleClickOutside = (event) => {
    if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
      this.setState({ isDropdownOpen: false });
    }
  };

  handleDropdownMouseEnter = () => {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.setState({ isDropdownOpen: true });
  };

  handleDropdownMouseLeave = () => {
    this.closeTimer = setTimeout(() => {
      this.setState({ isDropdownOpen: false });
    }, 2000);
  };

  toggleDropdown = () => {
    this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  };

  logout() {
    sessionStorage.clear();
    window.location.href = "/";
  }
  toggleDrawer = event => {
    event.preventDefault();
    this.setState(prevState => {
      return { navBarDrawer: !prevState.navBarDrawer };
    });
  };

  handleSearchChange = event => {
    this.setState({ search: event.target.value });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    const { search } = this.state;
    this.props.history.push("/?search=" + encodeURIComponent(search));
  };

  render() {
    const sessionUser = sessionStorage.getItem("username");
    const { search } = this.state;
    let sideDrawer;
    if (this.state.navBarDrawer) {
      sideDrawer = <SideDrawer />;
    }
    
    const userImage = (this.props.profile && this.props.profile.image) || profileImage;

    return (
      <header className="site-header">
        <nav className="navbar app-navbar" aria-label="Primary navigation">
          <div className="navbar-brand-group">
            <button
              className="menu-toggle"
              type="button"
              onClick={this.toggleDrawer}
              aria-label="Open menu"
            >
              <i className="fas fa-bars" id="nav-icon" />
            </button>
            <Link to="/" className="brand-link">
              Author's Haven
            </Link>
          </div>

          <div className="form-group has-search">
            <form className="form-inline" onSubmit={this.handleSearchSubmit}>
              <TextField
                className="form-control-search"
                type="search"
                size="small"
                placeholder="Search stories..."
                aria-label="Search"
                value={search}
                onChange={this.handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="fa fa-search" id="search-icon" />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </form>
          </div>

          {sessionUser ? (
            <ul className="nav navbar-nav nav-actions authenticated-actions">
              <li className="nav-item notification-item">
                <img src={BellIcon} id="notification-icon" alt="Notifications" />
              </li>
              <li className="nav-item">
                <div 
                  className="dropdown"
                  ref={this.dropdownRef}
                  onMouseEnter={this.handleDropdownMouseEnter}
                  onMouseLeave={this.handleDropdownMouseLeave}
                >
                  <img
                    className="dropbtn profile-img"
                    src={userImage}
                    alt="Profile"
                    onClick={this.toggleDropdown}
                  />
                  <div 
                    className={`dropdown-content ${this.state.isDropdownOpen ? 'show' : ''}`}
                    onClick={() => this.setState({ isDropdownOpen: false })}
                  >
                    <a
                      className="navlink"
                      href={`/profile/${sessionStorage.getItem("username")}`}
                    >
                      Profile
                    </a>
                    <Link className="navlink" to="/create-article">
                      Create Article
                    </Link>
                    <Link className="navlink" to="/user-articles/">
                      Your Stories
                    </Link>
                    <Link className="navlink" to="/favorites">
                      Your favorites
                    </Link>
                    <a href="/" className="navlink" onClick={this.logout}>
                      Log out
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          ) : (
            <ul className="nav navbar-nav nav-actions guest-actions">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Sign In
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link get-started " to="/register">
                  Get Started
                </Link>
              </li>
            </ul>
          )}
        </nav>
        {sideDrawer}
      </header>
    );
  }
}
NavBarComponent.proptypes = {
  isAuthenticated: PropTypes.Boolean,
  isAuthenticatedSocial: PropTypes.Boolean
};
export const mapStateToProps = state => ({
  isAuthenticated: state.auth_login.loginSuccess,
  isAuthenticatedSocial: state.socialAuthReducer.isAuthenticated,
  profile: state.profileReducer.loggedInProfile
});
export default withRouter(connect(mapStateToProps, { getUsersProfileAction })(NavBarComponent));
