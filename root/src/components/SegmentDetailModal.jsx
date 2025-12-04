export default function SegmentDetailModal({ segment, onClose, onClearFilter }) {
  if (!segment) return null;

  const {
    title,
    description,
    totalSpend,
    percentOfTotal,
    records,
    teamsCount,
    servicesCount,
  } = segment;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        {description && <div className="small muted">{description}</div>}

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "1.3fr 1.3fr",
            rowGap: 10,
            columnGap: 24,
            fontSize: 13,
          }}
        >
          <div>
            <div className="small muted">Total spend (USD)</div>
            <div style={{ marginTop: 4, fontWeight: 800, color: "#4ade80" }}>
              ${Number(totalSpend || 0).toFixed(2)}
            </div>
          </div>

          <div>
            <div className="small muted">Share of filtered spend</div>
            <div style={{ marginTop: 4, fontWeight: 700 }}>{Math.round(percentOfTotal || 0)}%</div>
          </div>

          <div>
            <div className="small muted">Number of records</div>
            <div style={{ marginTop: 4 }}>{records}</div>
          </div>

          <div>
            <div className="small muted">Distinct teams / services</div>
            <div style={{ marginTop: 4 }}>
              {teamsCount} teams · {servicesCount} services
            </div>
          </div>
        </div>

        <div style={{ height: 22 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          {onClearFilter && (
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                onClearFilter();
                onClose();
              }}
            >
              Clear segment filter
            </button>
          )}
          <button className="btn btn-primary" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


