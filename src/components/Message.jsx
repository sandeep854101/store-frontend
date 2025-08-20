// Message.js
const Message = ({ variant = 'info', children }) => {
  const variants = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className={`p-4 rounded-md ${variants[variant]}`}>
      {children}
    </div>
  );
};

export default Message;