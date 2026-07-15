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

export class NavBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navBarDrawer: false
    };
    this.logout = this.logout.bind(this);
  }
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

  render() {
    const sessionUser = sessionStorage.getItem("username");
    let sideDrawer;
    if (this.state.navBarDrawer) {
      sideDrawer = <SideDrawer />;
    }

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
          {sessionUser ? (
            <ul className="nav navbar-nav nav-actions authenticated-actions">
              <li className="nav-item active">
                <div className="form-group has-search">
                  <form className="form-inline my-5 my-lg-0">
                    <TextField
                      className="form-control-search"
                      type="search"
                      size="small"
                      placeholder="Search"
                      aria-label="Search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <i className="fa fa-search" id="search-icon" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </form>
                </div>
              </li>
              <li className="nav-item notification-item">
                <img src={BellIcon} id="notification-icon" alt="Notifications" />
              </li>
              <li className="nav-item">
                <div className="dropdown">
                  <img
                    className="dropbtn profile-img"
                    src={profileImage}
                    alt="Profile"
                  />
                  <div className="dropdown-content">
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
const mapStateToProps = state => ({
  isAuthenticated: state.auth_login.loginSuccess,
  isAuthenticatedSocial: state.socialAuthReducer.isAuthenticated
});
export default withRouter(connect(mapStateToProps)(NavBarComponent));
