import React from "react";
import { Link } from "react-router-dom";
import "../styles/sidedrawer.scss";

const SideDrawer = props => {
  return (
    <div className="sideDrawer">
      <ul className="list-group">
        <li className="list-group-item">
          <Link to="/login" style={{ textDecoration: "none", color: "inherit", display: "block", width: "100%" }}>
            Sign In
          </Link>
        </li>
        <li className="list-group-item">
          <Link to="/register" style={{ textDecoration: "none", color: "inherit", display: "block", width: "100%" }}>
            Get Started
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default SideDrawer;
