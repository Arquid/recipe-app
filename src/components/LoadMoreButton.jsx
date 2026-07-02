export default function LoadMoreButton({ onClick, loading }) {
  return (
    <div className="rs-load-more-row">
      <button className="rs-load-more" onClick={onClick} disabled={loading}>
        {loading ? "Loading…" : "Show more recipes"}
      </button>
    </div>
  );
}