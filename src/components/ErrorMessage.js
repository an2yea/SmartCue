export default function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      {message}
      <style jsx>{`
        .error-message {
          color: #dc2626;
          padding: 1rem;
          margin: 1rem 0;
          background-color: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
} 