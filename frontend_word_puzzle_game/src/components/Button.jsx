import React from "react";
import "./components.css";

// PUBLIC_INTERFACE
/**
 * Button component supporting variants and sizes, with accessibility/features.
 *
 * Props:
 * - children: content inside the button
 * - variant: "primary" | "secondary" | "success" | "danger" (default "primary")
 * - size: "sm" | "md" | "lg" (default "md")
 * - loading: boolean (shows spinner, disables)
 * - disabled: boolean
 * - type: "button" | "submit" | "reset"
 * - onClick: function
 * - ariaLabel: string (passed to aria-label)
 * - ...others: pass other props (tabIndex, etc)
 */
const variantMap = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  success: "btn--success",
  danger: "btn--danger"
};
const sizeMap = {
  sm: "btn--sm",
  md: "btn--md",
  lg: "btn--lg"
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
      loading = false,
      disabled = false,
      type = "button",
      ariaLabel,
      className = "",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        type={type}
        className={`btn ${variantMap[variant] || ""} ${sizeMap[size] || ""} ${className}`}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        tabIndex={isDisabled ? -1 : undefined}
        {...rest}
      >
        {loading && <Spinner />}
        <span className={loading ? "btn__content--loading" : ""}>
          {children}
        </span>
      </button>
    );
  }
);

export default Button;
