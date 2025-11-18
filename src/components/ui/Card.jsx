import React from "react";

const Card = React.forwardRef(function Card(
  { as: Component = "div", className = "", children, ...rest },
  ref
) {
  const base =
    "rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm";
  return (
    <Component ref={ref} className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
});

export default Card;
