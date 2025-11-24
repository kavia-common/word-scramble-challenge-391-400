import React from "react";
import "./components.css";

// PUBLIC_INTERFACE
/**
 * Navbar component for branding/app navigation.
 *
 * Props:
 * - title: string (main heading, required)
 * - tagline: string (optional subtitle/tagline)
 * - actions: React node(s) (slot for right-side actions, e.g., <Help />)
 * - className: string (optional extra css classes)
 * - style: object (optional)
 * - ...others
 */
const Navbar = ({
  title,
  tagline,
  actions,
  className = "",
  style = {},
  ...rest
}) => (
  <nav
    className={`navbar ${className}`}
    style={style}
    aria-label="App Navbar"
    {...rest}
  >
    <div className="navbar__main">
      <span className="navbar__title">{title}</span>
      {tagline && (
        <span className="navbar__tagline">{tagline}</span>
      )}
    </div>
    {actions && (
      <div className="navbar__actions">
        {actions}
      </div>
    )}
  </nav>
);

export default Navbar;
