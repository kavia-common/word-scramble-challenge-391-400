import React from "react";
import "./components.css";

/**
 * Button component supporting variants, sizes, outline/ghost, icons, backgrounds, rounded, etc.
 * PUBLIC_INTERFACE
 *
 * Props:
 * - children: content inside the button (string or node)
 * - variant: "primary" | "secondary" | "success" | "danger" | "link" (default "primary")
 * - size: "sm" | "md" | "lg" (default "md")
 * - outline: boolean (render outlined version of variant)
 * - ghost: boolean (minimal color, only on hover/bg)
 * - fullWidth: boolean (button fills container width)
 * - rounded: "none" | "sm" | "md" | "lg" | "full" (default "md")
 * - leftIcon: node (icon before text)
 * - rightIcon: node (icon after text)
 * - iconOnly: boolean (button contains icon only, requires ariaLabel)
 * - loading: boolean (shows spinner, disables button)
 * - loadingText: string (optional, text shown when loading)
 * - disabled: boolean (disables button)
 * - ariaLabel: string (aria-label override, required if iconOnly)
 * - className/style: additional props passed to root
 * - as: "button" | "a" (default "button")
 * - type: "button" | "submit" | "reset" (for <button>)
 * - href: string (for <a>)
 * - ...rest: other attributes
 */

const VARIANTS = ["primary", "secondary", "success", "danger", "link"];
const SIZES = ["sm", "md", "lg"];
const ROUNDED = {
  none: "",
  sm: "btn--rounded-sm",
  md: "btn--rounded-md",
  lg: "btn--rounded-lg",
  full: "btn--rounded-full",
};

const variantToClass = (variant, outline, ghost) => {
  // Compute base and style-modifiers
  let base = `btn--${variant}`;
  if (ghost) return `btn--ghost btn--ghost-${variant}`;
  if (outline) return `btn--outline btn--outline-${variant}`;
  return base;
};

const Spinner = () => (
  <span
    className="btn__spinner"
    aria-hidden="true"
  />
);

const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      outline = false,
      ghost = false,
      fullWidth = false,
      rounded = "md",
      leftIcon,
      rightIcon,
      iconOnly = false,
      loading = false,
      loadingText,
      disabled = false,
      ariaLabel,
      className = "",
      style = {},
      as = "button",
      type = "button",
      href,
      ...rest
    },
    ref
  ) => {
    // Accessibility: If iconOnly, ariaLabel is required
    const ariaLabelVal = ariaLabel || (iconOnly && typeof children === "string" ? children : undefined);
    if (iconOnly && !ariaLabelVal) {
      // eslint-disable-next-line no-console
      console.warn("Button: ariaLabel is required when iconOnly is true.");
    }
    const workingVariant = VARIANTS.includes(variant) ? variant : "primary";
    const workingSize = SIZES.includes(size) ? size : "md";
    const roundedClass = ROUNDED[rounded] || ROUNDED.md;
    const isDisabled = disabled || loading;

    const Tag = as === "a" ? "a" : "button";
    // Class calculation
    let btnClass =
      `btn ${variantToClass(workingVariant, outline, ghost)} btn--${workingSize}` +
      (roundedClass ? ` ${roundedClass}` : "") +
      (iconOnly ? " btn--iconOnly" : "") +
      (fullWidth ? " btn--fullwidth" : "") +
      (className ? ` ${className}` : "");

    // Must not pass type or disabled to <a>
    const btnProps = {
      ref,
      className: btnClass,
      style,
      tabIndex: isDisabled ? -1 : rest.tabIndex,
      "aria-label": ariaLabelVal,
      "aria-disabled": isDisabled,
      "aria-busy": loading || undefined,
      ...(Tag === "a"
        ? {
            href: isDisabled ? undefined : href,
            role: "button",
            onClick: isDisabled
              ? (e) => e.preventDefault()
              : rest.onClick,
          }
        : {
            type,
            disabled: isDisabled,
            ...rest,
          }),
    };
    // Remove onClick from rest if <a> (to prevent warnings)
    if (Tag === "a" && "onClick" in btnProps && !btnProps.onClick) {
      delete btnProps.onClick;
    }
    // Only allow children or icons
    const innerContent = (
      <React.Fragment>
        {loading && <Spinner />}
        {leftIcon && (
          <span className="btn__icon btn__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span
          className={
            loading ? "btn__content btn__content--loading" : "btn__content"
          }
        >
          {loading && loadingText
            ? loadingText
            : iconOnly
            ? null
            : children}
        </span>
        {rightIcon && (
          <span className="btn__icon btn__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </React.Fragment>
    );
    if (iconOnly) {
      // Only render icon, hide children from dom if present
      return (
        <Tag {...btnProps}>
          {loading && <Spinner />}
          {leftIcon && (
            <span className="btn__icon" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          {!leftIcon && !rightIcon && !loading && typeof children !== "string"
            ? children
            : null}
          {rightIcon && (
            <span className="btn__icon" aria-hidden="true">
              {rightIcon}
            </span>
          )}
          <span className="sr-only">{ariaLabelVal}</span>
        </Tag>
      );
    }
    return <Tag {...btnProps}>{innerContent}</Tag>;
  }
);

export default Button;
