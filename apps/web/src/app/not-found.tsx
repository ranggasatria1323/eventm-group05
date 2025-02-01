export default function NotFoundPage() {
    return (<>
      <div className="max-sm:hidden min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        {/* Animated Illustration */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/753/753345.png"
            alt="404 Illustration"
            className="w-40 h-40 mb-6 animate-bounce"
          />
        </div>
  
        {/* Error Title */}
        <h1 className="text-5xl font-extrabold mb-4 text-blue-400">
          404 - Page Not Found
        </h1>
  
        {/* Error Message */}
        <p className="text-lg text-gray-300 mb-6 text-center">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
  
        {/* Call-to-Action */}
        <a
          href="/"
          className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-md shadow hover:bg-blue-600 hover:shadow-lg transition duration-300"
        >
          Back to Homepage
        </a>
  
        {/* Background Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>
        </div>
      </div>
      </>
    );
  }
  