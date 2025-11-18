import React from "react";

const Panel = React.forwardRef(function Panel(
  { as: Component = "div", className = "", children, ...rest },
  ref
) {
  const base =
    "rounded-xl border border-slate-800 bg-slate-950/80 p-3 shadow-none";
  return (
    <Component ref={ref} className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
});

export default Panel;
