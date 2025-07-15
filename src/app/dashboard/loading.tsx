export default function Loading({
  fullScreen = true,
}: {
  fullScreen?: boolean;
}) {
  return (
    <div
      className={`flex justify-center items-center ${
        fullScreen ? "h-screen" : ""
      }`}
    >
      <div className="flex items-center">
        <h1
          className={`${fullScreen ? "text-4xl" : "text-2xl"} mr-2 font-light`}
        >
          Loading
        </h1>
        <svg className="spinner w-10 h-10" viewBox="0 0 50 50">
          <circle
            className="path"
            cx="25"
            cy="25"
            r="15"
            fill="none"
            strokeWidth="5"
          ></circle>
        </svg>
      </div>
    </div>
  );
}
