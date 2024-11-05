export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <style jsx>{`
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 