import React from "react";
import "./components.css";

/**
 * Card component for grouping UI content with theme surface, borders, shadow, roundedness, and flexible content.
 * 
 * PUBLIC_INTERFACE
 * 
 * Props:
 * - title: React node/string (optional) - card title at the top
 * - subtitle: React node/string (optional) - subtitle below title
 * - footer: React node/string (optional) - footer at the bottom
 * - children: main card content
 * - variant: "default" | "outlined" | "elevated" (default "default")
 * - padded: boolean (extra inner padding, default true)
 * - hoverable: boolean (adds hover effect)
 * - interactive: boolean (adds button-like semantics if onClick is present)
 * - rounded: "sm" | "md" | "lg" (default "md")
 * - className: extra CSS classes
 * - style: inline style object
 * - onClick: function (optional, makes card clickable)
 * - ...rest: other props
 */
const ROUNDED_MAP = {
  sm: "card--rounded-sm",
  md: "card--rounded-md",
  lg: "card--rounded-lg",
};

function Card({
  title,
  subtitle,
  footer,
  children,
  variant = "default",
  padded = true,
  hoverable = false,
  interactive = false,
  rounded = "md",
  className = "",
  style = {},
  onClick,
  ...rest
}) {
  const isInteractive = typeof onClick === "function" || interactive;
  const role = isInteractive ? "button" : undefined;
  const tabIndex = isInteractive ? 0 : rest.tabIndex;
  // For accessibility: aria-label if interactive and title is present
  const ariaLabel =
    isInteractive && typeof title === "string"
      ? title
      : rest["aria-label"];
  const hasTitle = !!title;

  let cardClass =
    "kavia-card" +
    (variant === "outlined"
      ? " card--outlined"
      : variant === "elevated"
      ? " card--elevated"
      : "") +
    (ROUNDED_MAP[rounded] ? ` ${ROUNDED_MAP[rounded]}` : "") +
    (padded ? " card--padded" : "") +
    (hoverable ? " card--hoverable" : "") +
    (isInteractive ? " card--interactive" : "") +
    (className ? ` ${className}` : "");

  // Keyboard/ARIA: Space/Enter clicks
  const handleKeyDown = (e) => {
    if (!isInteractive) return;
    if (
      (e.key === "Enter" || e.key === " ") &&
      typeof onClick === "function"
    ) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <section
      className={cardClass}
      style={style}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-pressed={undefined}
      {...rest}
    >
      {hasTitle && (
        <header className="card__header">
          <h2 className="card__title">{title}</h2>
          {subtitle && <div className="card__subtitle">{subtitle}</div>}
        </header>
      )}
      <div className="card__body">{children}</div>
      {!!footer && <footer className="card__footer">{footer}</footer>}
    </section>
  );
}

export default Card;
