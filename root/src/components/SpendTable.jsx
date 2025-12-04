import awsIcon from '../assets/aws-svgrepo-com.svg';
import gcpIcon from '../assets/gcp-svgrepo-com.svg';
import { getProvider } from "../utils/provider";

export default function SpendTable({
  loading,
  error,
  filteredCount,
  paginatedRows,
  pageSize,
  currentPage,
  totalPages,
  onPageSizeChange,
  onPageChange,
  onRowSelect,
}) {
  const showingText =
    filteredCount === 0
      ? "Showing 0 rows"
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(
          currentPage * pageSize,
          filteredCount
        )} of ${filteredCount} rows`;

  return (
    <div className="table-container" role="region" aria-label="Spend table">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="small muted" aria-live="polite">
          {showingText}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <label className="small muted" htmlFor="page-size">
            Page size
          </label>
          <select
            id="page-size"
            className="filter-control"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value) || 10)}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="table-header">
        <div>DATE</div>
        <div>CLOUD</div>
        <div>SERVICE</div>
        <div>TEAM</div>
        <div>ENV</div>
        <div style={{ textAlign: "right" }}>COST</div>
      </div>

      <div className="table-body">
        {loading && (
          <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
            Loading…
          </div>
        )}
        {error && !loading && (
          <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
            {error}
          </div>
        )}
        {!loading && !error && filteredCount === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
            No matching rows.
          </div>
        )}

        {!loading &&
          !error &&
          paginatedRows.map((row) => {
            const provider = getProvider(row);
            const badgeClass =
              provider === "GCP" ? "badge--gcp" : provider === "AWS" ? "badge--aws" : "";

            const team = (row.team || "").toLowerCase();
            let teamClass = "team-pill";
            if (team === "web") teamClass += " team-pill--web";
            else if (team === "data") teamClass += " team-pill--data";
            else if (team === "core") teamClass += " team-pill--core";

            return (
              <div
                key={row._id || `${provider || "unknown"}-${row.date}-${Math.random()}`}
                className="table-row"
                onClick={() => onRowSelect(row)}
                style={{ cursor: "pointer" }}
              >
                <div className="cell cell-date" data-label="Date">
                  {String(row.date || "").slice(0, 10)}
                </div>
                <div className="cell cell-cloud" data-label="Cloud">
                  <span className={`badge ${badgeClass}`}>{provider || "N/A"}</span>
                  {provider === "AWS" && (
                    <img src={awsIcon} alt="AWS" style={{ width: 22, height: 22, background: '#fff', padding: 2, borderRadius: 5, marginLeft: 6 }} />
                  )}
                  {provider === "GCP" && (
                    <img src={gcpIcon} alt="GCP" style={{ width: 22, height: 22, marginLeft: 6 }} />
                  )}
                </div>
                <div className="cell cell-service" data-label="Service">
                  <span className="service-pill">{row.service || "-"}</span>
                </div>
                <div className="cell cell-team" data-label="Team">
                  <span className={teamClass}>{row.team || "-"}</span>
                </div>
                <div className="cell cell-env" data-label="Env">
                  <span
                    className={`env-pill ${
                      row.env === "prod" ? "env-prod" : row.env === "dev" ? "env-dev" : "env-staging"
                    }`}
                  >
                    {row.env ? row.env.toUpperCase() : "N/A"}
                  </span>
                </div>
                <div className="cell cell-cost" data-label="Cost">
                  ${Number(row.cost_usd || 0).toFixed(2)}
                </div>
              </div>
            );
          })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px 4px",
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="small muted">
          Page {currentPage} of {totalPages}
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

