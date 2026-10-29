const variantClasses = {
  success: "bg-green-50 text-green-800 ring-green-200",
  danger: "bg-red-50 text-red-800 ring-red-200",
  info: "bg-sky-50 text-sky-800 ring-sky-200",
};

const Message = ({ variant, children }) => {
  const classes = variantClasses[variant] ?? "bg-amber-50 text-amber-800 ring-amber-200";

  return <div className={`rounded-xl p-4 ring-1 ${classes}`}>{children}</div>;
};

export default Message;
