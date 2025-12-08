// frontend/src/components/SummaryBar.jsx
import React from "react";
import PropTypes from "prop-types";

/**
SummaryBar - presentational only
 */
export default function SummaryBar({ loading, error, providersCount, totalSpend, totalRecords }) {
  // Safe currency formatter
  const formatCurrency = (n) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n ?? 0);
    } catch {
      return `$${(Number(n ?? 0) || 0).toFixed(2)}`;
    }
  };

  return (
    <div className="summary-row" role="region" aria-label="Summary cards" style={{ marginBottom: 18 }}>
      <div className="summary-card panel" aria-hidden>
        <div className="summary-label">PROVIDERS</div>
        <div className="summary-value" style={{ color: "#fff" }}>
          {loading ? "—" : error ? "—" : providersCount}
        </div>
        <div className="small muted">Cloud platforms</div>
      </div>

      <div className="summary-card panel" aria-hidden>
        <div className="summary-label">TOTAL SPEND</div>
        <div className="summary-value" style={{ color: "var(--aws-orange)" }}>
          {loading ? "—" : error ? "—" : formatCurrency(totalSpend)}
        </div>
        <div className="small muted">Across all providers</div>
      </div>

      <div className="summary-card panel" aria-hidden>
        <div className="summary-label">TOTAL RECORDS</div>
        <div className="summary-value" style={{ color: "#fff" }}>
          {loading ? "—" : error ? "—" : totalRecords}
        </div>
        <div className="small muted">Spend transactions</div>
      </div>

    </div>
  );
}

SummaryBar.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  providersCount: PropTypes.number,
  totalSpend: PropTypes.number,
  totalRecords: PropTypes.number,
};

SummaryBar.defaultProps = {
  loading: false,
  error: null,
  providersCount: 0,
  totalSpend: 0,
  totalRecords: 0,
};
