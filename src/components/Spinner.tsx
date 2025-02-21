const Spinner = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-6 h-6 border-4",
    large: "w-8 h-8 border-4",
  };

  return (
    <div className={`border-gray-300 border-t-blue-100 animate-spin rounded-full ${sizeClasses[size]}`} />
  );
};

export default Spinner;
