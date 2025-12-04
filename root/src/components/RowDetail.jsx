import { getProvider } from "../utils/provider";

export default function RowDetail({ row, onClose }) {
  if (!row) return null;

  const provider = getProvider(row);
  const badgeClass = provider === "GCP" ? "badge--gcp" : provider === "AWS" ? "badge--aws" : "";

  const explanationParts = [];
  if (provider) explanationParts.push(provider);
  if (row.service) explanationParts.push(row.service);
  const teamPhrase = row.team ? `${row.team} team` : "";
  const envPhrase = row.env ? `${row.env} environment` : "";
  const joined = explanationParts.join(" ");
  const explanation =
    (joined || teamPhrase || envPhrase) &&
    `This is ${joined || "cloud spend"} from the ${teamPhrase || "unspecified team"} in the ${
      envPhrase || "unspecified environment"
    }.`;

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
        <div className="small muted">All fields for this entry</div>
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            display: "grid",
            gridTemplateColumns: "1.2fr 2fr",
            rowGap: 6,
          }}
        >
          {Object.entries(row).map(([key, value]) => (
            <>
              <div style={{ textTransform: "capitalize", color: "var(--text-muted)" }}>{key}</div>
              <div>{String(value ?? "-")}</div>
            </>
          ))}
        </div>

        {explanation && (
          <>
            <div style={{ height: 18 }} />
            <div className="small muted">{explanation}</div>
          </>
        )}

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
