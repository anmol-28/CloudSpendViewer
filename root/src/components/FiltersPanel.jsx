import React from "react";

export default function FiltersPanel({
  filters,
  onFilterChange,
  sortField,
  sortDir,
  onSortChange,
  onReset,
  onRefresh,
}) {
  const MonthInput = () => {
    const [monthInput, setMonthInput] = React.useState(filters.month || "");
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      setMonthInput(filters.month || "");
      setHasError(false);
    }, [filters.month]);

    const sanitize = (val) => {
      let raw = (val || "").replace(/[^\d-]/g, "");
      const digits = raw.replace(/-/g, "");

      if (digits.length <= 4) {
        // YYYY
        raw = digits;
      } else if (digits.length <= 6) {
        // YYYYMM -> YYYY-MM
        const y = digits.slice(0, 4);
        const m = digits.slice(4, 6);
        raw = y + (m ? "-" + m : "");
      } else {
        // YYYYMMDD -> YYYY-MM-DD
        const y = digits.slice(0, 4);
        const m = digits.slice(4, 6);
        const d = digits.slice(6, 8);
        raw = y + (m ? "-" + m : "") + (d ? "-" + d : "");
      }

      return raw.slice(0, 10);
    };

    const validate = (cleaned) => {
      // Empty is always allowed (no filter, no error)
      if (!cleaned) {
        return { isValid: true, finalValue: "" };
      }

      // Must be YYYY, YYYY-MM, or YYYY-MM-DD
      const match = cleaned.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
      if (!match) {
        return { isValid: false, finalValue: "" };
      }

      const yearNum = Number(match[1]);
      const monthNum = match[2] != null ? Number(match[2]) : null;
      const dayNum = match[3] != null ? Number(match[3]) : null;

      const MIN_YEAR = 2000;
      const MAX_YEAR = 2025;
      if (!Number.isFinite(yearNum) || yearNum < MIN_YEAR || yearNum > MAX_YEAR) {
        return { isValid: false, finalValue: "" };
      }

      let finalValue = match[1];
      if (monthNum != null) {
        if (!Number.isFinite(monthNum) || monthNum < 1 || monthNum > 12) {
          return { isValid: false, finalValue: "" };
        }
        const monthStr = String(monthNum).padStart(2, "0");
        finalValue = `${match[1]}-${monthStr}`;

        if (dayNum != null) {
          if (!Number.isFinite(dayNum) || dayNum < 1 || dayNum > 31) {
            return { isValid: false, finalValue: "" };
          }
          const dayStr = String(dayNum).padStart(2, "0");
          finalValue = `${finalValue}-${dayStr}`;
        }
      }

      return { isValid: true, finalValue };
    };

    const commit = (value) => {
      const cleaned = sanitize(value);
      const { isValid, finalValue } = validate(cleaned);

      if (!isValid) {
        setHasError(true);
        onFilterChange("month", "");
        return;
      }

      // Valid: update local input (normalized) and propagate filter
      setHasError(false);
      setMonthInput(finalValue);
      onFilterChange("month", finalValue);
    };

    return (
      <div>
        <input
          className={`filter-control${hasError ? " filter-control--error" : ""}`}
          type="text"
          inputMode="numeric"
          placeholder="YYYY-MM-DD"
          value={monthInput}
          onChange={(e) => {
            const next = sanitize(e.target.value);
            setMonthInput(next);
            const { isValid } = validate(next);
            setHasError(!isValid && next.length > 0);
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit(e.currentTarget.value);
              e.currentTarget.blur();
            }
          }}
          aria-label="Date (YYYY-MM-DD)"
        />
        {hasError && (
          <div className="field-error-text" aria-live="polite">
            Enter correct date
          </div>
        )}
      </div>
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
              onReset();
            }}
          >
            Reset
          </button>

          <button className="btn btn-primary" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </div>

      <div className="filters-row" style={{ marginTop: 12 }}>
        <div className="filter-group">
          <label className="small muted">CLOUD PROVIDERS</label>
          <select
            className="filter-control"
            value={filters.cloud || ""}
            onChange={(e) => onFilterChange("cloud", e.target.value)}
            aria-label="Cloud"
          >
            <option value="">All Clouds</option>
            <option value="AWS">AWS(Amazon)</option>
            <option value="GCP">GCP(Google)</option>
          </select>
        </div>

        <div className="filter-group filter-group--wide">
          <label className="small muted">TEAM</label>
          <select
            className="filter-control"
            value={filters.team || ""}
            onChange={(e) => onFilterChange("team", e.target.value)}
            aria-label="Team"
          >
            <option value="">All Teams</option>
            <option value="Web">Web</option>
            <option value="Data">Data</option>
            <option value="Core">Core</option>
          </select>
        </div>

        <div className="filter-group filter-group--compact">
          <label className="small muted">ENV(ENVIRONMENT)</label>
          <select
            className="filter-control"
            value={filters.env || ""}
            onChange={(e) => onFilterChange("env", e.target.value)}
            aria-label="Environment"
          >
            <option value="">All</option>
            <option value="prod">prod</option>
            <option value="staging">staging</option>
            <option value="dev">dev</option>
          </select>
        </div>

        <div className="filter-group filter-group--compact">
          <label className="small muted">DATE</label>
          <MonthInput />
        </div>

        <div className="filter-group filter-group--compact">
          <label className="small muted">SORT</label>
          <select
            className="filter-control"
            value={`${sortField || "date"}|${sortDir || "desc"}`}
            onChange={(e) => {
              const [field, dir] = String(e.target.value).split("|");
              onSortChange(field, dir);
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
  );
}

