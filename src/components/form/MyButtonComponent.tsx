import { ReactNode, useState } from "react";

interface MyButtonComponentProps {
  onClick: () => void
  className?: string
  children: ReactNode
}

export default function MyButtonComponent({onClick, className = "", children}: MyButtonComponentProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center px-4 py-2 rounded text-white font-semibold transition cursor-pointer w-full
        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}