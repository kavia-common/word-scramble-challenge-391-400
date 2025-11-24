import React, { useState, useRef } from "react";
import "./components.css";

/**
 * PUBLIC_INTERFACE
 * Modular, accessible, composable Navbar component for branding/app navigation.
 *
 * Props:
 * - as: "nav" | "header" | "div" (default "nav") - semantic element wrapper
 * - role: optional override of ARIA role (default: computed by 'as')
 * - logoSrc, logoAlt: (optional) brand logo
 * - title: string or node (brand title, main heading)
 * - subtitle: string or node (optional subtitle/tagline)
 * - brandArea: node (render prop, overrides logo/title/subtitle)
 * - leftSlot, centerSlot, rightSlot: render props (flexible slots for left/center/right)
 * - variant: "default" | "transparent" | "elevated" | "bordered" (default: "default")
 * - size: "sm" | "md" | "lg" (default: "md")
 * - sticky: boolean (navbar sticky to top)
 * - absolute: boolean (absolutely positioned at top)
 * - collapsedByDefault: boolean (mobile starts collapsed; default: false)
 * - showOnMobile: boolean (show collapse menu button on mobile; default: true)
 * - collapseId: string (id for collapsible content and aria-controls)
 * - className, style: passthrough to root
 * - children: content for collapsible section (if collapsed on mobile)
 * - ...rest: passthrough
 */
const VARIANTS = ["default", "transparent", "elevated", "bordered"];
const SIZES = ["sm", "md", "lg"];

function Navbar({
  as = "nav",
  role,
  logoSrc,
  logoAlt = "Brand Logo",
  title,
  subtitle,
  brandArea,

  leftSlot,
  centerSlot,
  rightSlot,

  variant = "default",
  size = "md",
  sticky = false,
  absolute = false,
  collapsedByDefault = false,
  showOnMobile = true,
  collapseId = "navbar-collapse",
  className = "",
  style = {},
  children,

  ...rest
}) {
  const [collapsed, setCollapsed] = useState(collapsedByDefault);
  const menuBtnRef = useRef();

  // "as" prop maps to semantic container
  const RootTag = ["nav", "header", "div"].includes(as) ? as : "nav";
  const computedRole = role ? role : (RootTag === "nav" ? "navigation" : undefined);

  // Build class list
  let navClass =
    "navbar" +
    (VARIANTS.includes(variant) && variant !== "default" ? ` navbar--${variant}` : "") +
    (SIZES.includes(size) && size !== "md" ? ` navbar--${size}` : "") +
    (sticky ? " navbar--sticky" : "") +
    (absolute ? " navbar--absolute" : "") +
    (showOnMobile ? " navbar--responsive" : "") +
    (className ? ` ${className}` : "");

  // Brand area content logic
  let brandContent = null;
  if (brandArea) {
    brandContent = typeof brandArea === "function" ? brandArea() : brandArea;
  } else if (logoSrc || title || subtitle) {
    brandContent = (
      <span className="navbar__brandarea">
        {logoSrc && (
          <img
            src={logoSrc}
            alt={logoAlt}
            className="navbar__logo"
            height="32"
            width="32"
            style={{ marginRight: title ? "0.73em" : 0 }}
            aria-hidden={title ? "true" : undefined}
          />
        )}
        <span className="navbar__main">
          {title && <span className="navbar__title">{title}</span>}
          {subtitle && <span className="navbar__subtitle">{subtitle}</span>}
        </span>
      </span>
    );
  }

  // Accessibility: aria-controls and aria-expanded for menu toggler
  const collapseAriaControls = collapseId || "navbar-collapse";
  const isCollapsed = !collapsed;
  const expanded = !collapsed;

  // Determine if collapse button should be rendered
  const shouldShowCollapsible =
    (children || centerSlot || rightSlot) && showOnMobile;

  // Handler for collapsing
  function toggleCollapse() {
    setCollapsed((val) => !val);
  }

  return (
    <RootTag
      role={computedRole}
      className={navClass}
      style={style}
      aria-label={rest["aria-label"] || "App Navbar"}
      {...rest}
    >
      {/* Left section */}
      <div className="navbar__section navbar__left">
        {leftSlot}
        {!!brandContent && brandContent}
      </div>

      {/* Center slot -- hidden on mobile if using collapse */}
      {(centerSlot || null) && (
        <div className="navbar__section navbar__center">{centerSlot}</div>
      )}

      {/* Right section (actions/links) */}
      {(rightSlot || shouldShowCollapsible) && (
        <div className="navbar__section navbar__right">
          {/* Collapsible hamburger */}
          {shouldShowCollapsible && (
            <button
              className="navbar__toggle-btn"
              aria-label="Menu"
              aria-controls={collapseAriaControls}
              aria-expanded={collapsed}
              aria-haspopup="true"
              onClick={toggleCollapse}
              ref={menuBtnRef}
              tabIndex={0}
              type="button"
            >
              <span className="navbar__toggle-icon" aria-hidden="true">
                {/* Hamburger icon */}
                <svg width="23" height="23" viewBox="0 0 24 24" aria-hidden="true">
                  <rect y="5" width="24" height="3" rx="1.5" fill="currentColor" />
                  <rect y="11" width="24" height="3" rx="1.5" fill="currentColor" />
                  <rect y="17" width="24" height="3" rx="1.5" fill="currentColor" />
                </svg>
              </span>
            </button>
          )}
          {!!rightSlot && rightSlot}
        </div>
      )}

      {/* Collapsible area: for mobile, toggled collapse */}
      {shouldShowCollapsible && (
        <div
          id={collapseAriaControls}
          className={`navbar__collapse${collapsed ? " navbar__collapse--open" : ""}`}
          aria-hidden={!collapsed}
          style={{
            display: collapsed ? undefined : "none"
          }}
        >
          {children}
        </div>
      )}
    </RootTag>
  );
}

export default Navbar;
