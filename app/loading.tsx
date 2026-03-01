export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <span className="spinner" />
        <p className="text-gray-500 mt-4">טוען...</p>
      </div>
    </div>
  );
}
