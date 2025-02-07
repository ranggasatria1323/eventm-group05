export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-700 text-white">
      <div className="text-center">
        {/* Animated Error Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-24 h-24 bg-red-800 rounded-full flex items-center justify-center">
            <span className="absolute text-6xl font-bold text-red-200">!</span>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-5xl font-extrabold mb-4 animate-pulse">403</h1>

        {/* Error Message */}
        <p className="text-lg text-gray-200 mb-8">
          Oops! You don't have permission to access this page.
        </p>

        {/* Call-to-Action */}
        <a
          href="/"
          className="px-6 py-3 bg-white text-red-700 font-semibold text-lg rounded-md shadow hover:bg-gray-200 hover:shadow-md transition duration-300"
        >
          Go Back to Homepage
        </a>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-300 opacity-20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-400 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
