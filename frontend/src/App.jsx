// frontend/src/App.jsx
import React, { useEffect, useState, useMemo } from "react";
import "./index.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("date"); // default sort field
  const [sortDir, setSortDir] = useState("desc"); // 'asc' | 'desc'

  // Fetch real data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/spend");
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.rows || [];
      setRows(arr);
    } catch (err) {
      setError("Failed to fetch data from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // helper to update a filter key
  const setFilter = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value === "" ? null : value }));
  };

  // ---------- Filtering + Sorting ----------
  const filtered = useMemo(() => {
    const f = rows.filter((r) => {
      if (filters.cloud && r.cloud !== filters.cloud) return false;
      if (filters.team && r.team !== filters.team) return false;
      if (filters.env && r.env !== filters.env) return false;
      if (filters.month) {
        const recordMonth = String(r.date || "").slice(0, 7);
        if (recordMonth !== filters.month) return false;
      }
      return true;
    });

    if (!sortField) return f;

    const sorted = [...f].sort((a, b) => {
      const sf = sortField;
      const dir = sortDir === "asc" ? 1 : -1;

      if (sf === "cost") {
        const A = Number(a.cost_usd || 0);
        const B = Number(b.cost_usd || 0);
        return (A - B) * dir;
      }
      if (sf === "date") {
        const A = new Date(a.date || 0).getTime();
        const B = new Date(b.date || 0).getTime();
        return (A - B) * dir;
      }
      return 0;
    });

    return sorted;
  }, [rows, filters, sortField, sortDir]);

  // ---------- Summary values ----------
  const totalSpend = useMemo(() => rows.reduce((s, r) => s + Number(r.cost_usd || 0), 0), [rows]);
  const totalRecords = rows.length;
  const providersCount = useMemo(
    () => new Set(rows.map((r) => r.cloud).filter(Boolean)).size,
    [rows]
  );

  // ---------- UI ----------
  function HeaderHero() {
    return (
      <div className="header-hero panel" role="banner" aria-label="Cloud Spend header">
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 10,
              background: "linear-gradient(135deg,#FF9900 0%, #111827 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontWeight: 800,
              fontSize: 22,
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
            }}
            aria-hidden
          >
            ☁
          </div>

          <div>
            <h1 className="header-title">K&Co Cloud Spend Viewer</h1>
            <div className="header-sub">Real-Time Cost Insights and Tracking</div>
          </div>
        </div>
      </div>
    );
  }

  function SummaryCards() {
    return (
      <div className="summary-row" role="region" aria-label="Summary cards" style={{ marginBottom: 18 }}>
        <div className="summary-card panel" aria-hidden>
          <div className="summary-label">PROVIDERS</div>
          <div className="summary-value" style={{ color: "#fff" }}>
            {loading ? "—" : providersCount}
          </div>
          <div className="small muted">Cloud platforms</div>
        </div>

        <div className="summary-card panel" aria-hidden>
          <div className="summary-label">TOTAL SPEND</div>
          <div className="summary-value" style={{ color: "var(--aws-orange)" }}>
            {loading
              ? "—"
              : `$${totalSpend.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
          </div>
          <div className="small muted">Across all providers</div>
        </div>

        <div className="summary-card panel" aria-hidden>
          <div className="summary-label">TOTAL RECORDS</div>
          <div className="summary-value" style={{ color: "#fff" }}>
            {loading ? "—" : totalRecords}
          </div>
          <div className="small muted">Spend transactions</div>
        </div>
      </div>
    );
  }

  function FiltersBlock() {
    // Nested MonthInput component keeps local typing state to avoid mid-typing overwrites
    const MonthInput = () => {
      const [monthInput, setMonthInput] = React.useState(filters.month || "");

      // sync if external filters.month changes
      React.useEffect(() => {
        setMonthInput(filters.month || "");
      }, [filters.month]);

      const commit = (val) => {
        const cleaned = (val || "").replace(/[^\d]/g, "");
        if (cleaned.length <= 4) {
          setFilter("month", cleaned.slice(0, 4));
        } else {
          const year = cleaned.slice(0, 4);
          const month = cleaned.slice(4, 6);
          setFilter("month", year + (month ? "-" + month : ""));
        }
      };

      return (
        <input
          className="filter-control"
          type="text"
          inputMode="numeric"
          placeholder="YYYY-MM"
          value={monthInput}
          onChange={(e) => {
            // allow digits and hyphen while typing
            let raw = e.target.value || "";
            raw = raw.replace(/[^\d-]/g, "");
            const digits = raw.replace(/-/g, "");
            if (digits.length <= 4) {
              raw = digits;
            } else {
              const y = digits.slice(0, 4);
              const m = digits.slice(4, 6);
              raw = y + (m ? "-" + m : "");
            }
            raw = raw.slice(0, 7);
            setMonthInput(raw);
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit(e.currentTarget.value);
              e.currentTarget.blur();
            }
          }}
          aria-label="Month (YYYY-MM)"
          pattern="^\d{4}-(0[1-9]|1[0-2])$"
          title="Enter month as YYYY-MM (e.g., 2025-12)"
        />
      );
    };

    return (
      <div className="filters-block panel" role="region" aria-label="Filters">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Filters</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setFilters({});
                setSortField("date");
                setSortDir("desc");
                setSelected(null);
              }}
            >
              Reset
            </button>

            <button className="btn btn-primary" onClick={fetchData}>
              Refresh
            </button>
          </div>
        </div>

        <div className="filters-row" style={{ marginTop: 12 }}>
          {/* Cloud */}
          <div style={{ minWidth: 160 }}>
            <label className="small muted">CLOUD PROVIDERS</label>
            <div style={{ marginTop: 8 }}>
              <select
                className="filter-control"
                value={filters.cloud || ""}
                onChange={(e) => setFilter("cloud", e.target.value)}
                aria-label="Cloud"
              >
                <option value="">All Clouds</option>
                <option value="AWS">AWS(Amazon)</option>
                <option value="GCP">GCP(Google)</option>
              </select>
            </div>
          </div>

          {/* Team */}
          <div style={{ minWidth: 180 }}>
            <label className="small muted">TEAM</label>
            <div style={{ marginTop: 8 }}>
              <select
                className="filter-control"
                value={filters.team || ""}
                onChange={(e) => setFilter("team", e.target.value)}
                aria-label="Team"
              >
                <option value="">All Teams</option>
                <option value="Web">Web</option>
                <option value="Data">Data</option>
                <option value="Core">Core</option>
              </select>
            </div>
          </div>

          {/* Env */}
          <div style={{ minWidth: 140 }}>
            <label className="small muted">ENV(ENVIRONMENT)</label>
            <div style={{ marginTop: 8 }}>
              <select
                className="filter-control"
                value={filters.env || ""}
                onChange={(e) => setFilter("env", e.target.value)}
                aria-label="Environment"
              >
                <option value="">All</option>
                <option value="prod">prod</option>
                <option value="staging">staging</option>
                <option value="dev">dev</option>
              </select>
            </div>
          </div>

          {/* ▼▼▼ CHANGED: MONTH (plain YYYY-MM text field) ▼▼▼ */}
          <div style={{ minWidth: 140 }}>
            <label className="small muted">MONTH</label>
            <div style={{ marginTop: 8 }}>
              <MonthInput />
            </div>
          </div>
          {/* ▲▲▲ END CHANGE ▲▲▲ */}

          {/* Sort */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <div>
              <label className="small muted">SORT</label>
              <div style={{ marginTop: 8 }}>
                <select
                  className="filter-control"
                  value={`${sortField || "date"}|${sortDir || "desc"}`}
                  onChange={(e) => {
                    const [field, dir] = String(e.target.value).split("|");
                    setSortField(field);
                    setSortDir(dir);
                  }}
                  aria-label="Sort (field | direction)"
                >
                  <option value="date|desc">Date — Descending</option>
                  <option value="date|asc">Date — Ascending</option>
                  <option value="cost|desc">Cost — Descending</option>
                  <option value="cost|asc">Cost — Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SpendTableComponent() {
    return (
      <div className="table-container" role="region" aria-label="Spend table">
        <div className="table-header">
          <div style={{ width: 160 }}>DATE</div>
          <div style={{ width: 140 }}>CLOUD</div>
          <div style={{ flex: 1 }}>SERVICE</div>
          <div style={{ width: 180 }}>TEAM</div>
          <div style={{ width: 120 }}>ENV</div>
          <div style={{ width: 120, textAlign: "right" }}>COST</div>
        </div>

        <div className="table-body">
          {loading && (
            <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
              Loading…
            </div>
          )}
          {error && (
            <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
              {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
              No matching rows.
            </div>
          )}

          {!loading &&
            !error &&
            filtered.map((r) => (
              <div
                key={r._id || `${r.cloud}-${r.date}-${Math.random()}`}
                className="table-row"
                onClick={() => setSelected(r)}
                style={{ cursor: "pointer" }}
              >
                <div className="cell-date">{String(r.date || "").slice(0, 10)}</div>
                <div>
                  <span
                    className={`badge ${
                      r.cloud === "AWS" ? "badge--aws" : "badge--gcp"
                    }`}
                  >
                    {r.cloud}
                  </span>
                </div>
                <div>{r.service}</div>
                <div className="small muted">{r.team || "-"}</div>
                <div>
                  <span
                    className={`env-pill ${
                      r.env === "prod" ? "env-prod" : r.env === "dev" ? "env-dev" : "env-staging"
                    }`}
                  >
                    {r.env ? r.env.toUpperCase() : "N/A"}
                  </span>
                </div>
                <div className="cell-cost">
                  ${Number(r.cost_usd || 0).toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  function ProviderBreakdown({ awsTotal = 0, gcpTotal = 0 }) {
    const total = awsTotal + gcpTotal || 1;
    const awsPct = Math.round((awsTotal / total) * 100);
    const gcpPct = Math.round((gcpTotal / total) * 100);
    return (
      <div className="panel" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Spend by Provider</h3>

        <div className="breakdown" aria-hidden>
          <div className="bar-label">AWS(Amazon)</div>
          <div className="bar">
            <div className="bar-fill aws" style={{ width: `${awsPct}%` }} />
          </div>
          <div className="bar-amount">${awsTotal}</div>
        </div>

        <div className="breakdown" style={{ marginTop: 12 }} aria-hidden>
          <div className="bar-label">GCP(Google)</div>
          <div className="bar">
            <div className="bar-fill gcp" style={{ width: `${gcpPct}%` }} />
          </div>
          <div className="bar-amount">${gcpTotal}</div>
        </div>
      </div>
    );
  }

  function RowDetailModal({ row, onClose }) {
    if (!row) return null;
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
                <span
                  className={`badge ${
                    row.cloud === "AWS" ? "badge--aws" : "badge--gcp"
                  }`}
                >
                  {row.cloud}
                </span>
              </div>
              <div style={{ height: 8 }} />
              <div className="small muted">Team</div>
              <div style={{ marginTop: 6 }}>{row.team || "-"}</div>
            </div>

            <div style={{ width: 220 }}>
              <div className="small muted">Environment</div>
              <div style={{ marginTop: 6 }}>
                <span
                  className={`env-pill ${
                    row.env === "prod"
                      ? "env-prod"
                      : row.env === "dev"
                      ? "env-dev"
                      : "env-staging"
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
                  color: "var(--aws-orange)",
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

  const totals = filtered.reduce(
    (acc, r) => {
      if (r.cloud === "AWS") acc.aws += Number(r.cost_usd || 0);
      if (r.cloud === "GCP") acc.gcp += Number(r.cost_usd || 0);
      return acc;
    },
    { aws: 0, gcp: 0 }
  );

  return (
    <div className="app-root">
      <HeaderHero />
      <SummaryCards />
      <FiltersBlock />
      <div style={{ height: 16 }} />
      <SpendTableComponent />
      <ProviderBreakdown
        awsTotal={Math.round(totals.aws)}
        gcpTotal={Math.round(totals.gcp)}
      />
      <RowDetailModal row={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
