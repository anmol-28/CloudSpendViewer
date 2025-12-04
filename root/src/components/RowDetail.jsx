import { getProvider } from "../utils/provider";

export default function RowDetail({ row, onClose }) {
  if (!row) return null;

  const provider = getProvider(row);
  const badgeClass = provider === "GCP" ? "badge--gcp" : provider === "AWS" ? "badge--aws" : "";

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{row.service} — Details</h3>
        <div className="small muted">Date: {row.date}</div>
        <div style={{ height: 12 }} />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div className="small muted">Provider</div>
            <div style={{ marginTop: 6 }}>
              <span className={`badge ${badgeClass}`}>{provider || "N/A"}</span>
            </div>
            <div style={{ height: 8 }} />
            <div className="small muted">Team</div>
            <div style={{ marginTop: 6 }}>
              <span className="team-pill">
                {row.team || "-"}
              </span>
            </div>
          </div>

          <div style={{ width: 220 }}>
            <div className="small muted">Environment</div>
            <div style={{ marginTop: 6 }}>
              <span
                className={`env-pill ${
                  row.env === "prod" ? "env-prod" : row.env === "dev" ? "env-dev" : "env-staging"
                }`}
              >
                {row.env ? row.env.toUpperCase() : "N/A"}
              </span>
            </div>

            <div style={{ height: 8 }} />
            <div className="small muted">Cost (USD)</div>
            <div
              style={{
                marginTop: 6,
                fontWeight: 800,
                color: "#4ade80",
              }}
            >
              ${Number(row.cost_usd || 0).toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ height: 18 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
