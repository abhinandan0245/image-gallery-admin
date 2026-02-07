const Loader = ({ size = "medium", fullScreen = false }) => {
  const sizes = {
    small: {
      container: "w-8 h-8",
      border: "border-2"
    },
    medium: {
      container: "w-12 h-12",
      border: "border-3"
    },
    large: {
      container: "w-16 h-16",
      border: "border-4"
    }
  };

  const { container, border } = sizes[size];

  return (
    <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "min-h-[200px]"}`}>
      <div className="relative">
        <div className={`${container} ${border} border-blue-100 rounded-full`}></div>
        <div className={`absolute top-0 left-0 ${container} ${border} border-blue-600 rounded-full animate-spin border-t-transparent`}></div>
        
        {/* Optional: Add pulsing dots */}
        {size === "large" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse animation-delay-150"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse animation-delay-300"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;