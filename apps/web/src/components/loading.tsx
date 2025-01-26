'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A192F]">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-[#64ffda] border-[#112240] rounded-full animate-spin"></div>
        {/* Text */}
        <p className="mt-4 text-lg font-semibold text-[#ccd6f6]">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
