import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSpendRows } from "../services/spendService";
import { computeAggregates } from "../utils/aggregates";
import { getProvider } from "../utils/provider";

const DEFAULT_SORT_FIELD = "date";
const DEFAULT_SORT_DIR = "desc";

export function useSpendData(initialPageSize = 10) {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(DEFAULT_SORT_FIELD);
  const [sortDir, setSortDir] = useState(DEFAULT_SORT_DIR);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchSpendRows();
      setRows(data);
    } catch (err) {
      console.error("Failed to fetch spend data:", err);
      setError(err?.message || "Failed to load spend data");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      if (!value) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const resetControls = useCallback(() => {
    setFilters({});
    setSortField(DEFAULT_SORT_FIELD);
    setSortDir(DEFAULT_SORT_DIR);
    setSelectedRow(null);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortField, sortDir, pageSize]);

  const filteredRows = useMemo(() => {
    const results = rows.filter((row) => {
      const provider = getProvider(row);
      if (filters.cloud && provider !== filters.cloud) return false;
      if (filters.team && row.team !== filters.team) return false;
      if (filters.env && row.env !== filters.env) return false;
      if (filters.month) {
        const recordDate = String(row.date || "");
        const target = filters.month;

        // If user entered full date (YYYY-MM-DD), match exactly.
        // If only year-month (YYYY-MM), match by month.
        if (target.length === 10) {
          if (recordDate !== target) return false;
        } else {
          const recordMonth = recordDate.slice(0, 7);
          if (recordMonth !== target) return false;
        }
      }
      return true;
    });

    if (!sortField) return results;

    return [...results].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "cost") {
        const aCost = Number(a.cost_usd || 0);
        const bCost = Number(b.cost_usd || 0);
        return (aCost - bCost) * dir;
      }
      if (sortField === "date") {
        const aDate = new Date(a.date || 0).getTime();
        const bDate = new Date(b.date || 0).getTime();
        return (aDate - bDate) * dir;
      }
      return 0;
    });
  }, [rows, filters, sortField, sortDir]);

  const aggregates = useMemo(() => computeAggregates(filteredRows), [filteredRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, pageSize, currentPage]);

  return {
    loading,
    error,
    filters,
    sortField,
    sortDir,
    pageSize,
    currentPage,
    totalPages,
    filteredRows,
    filteredCount: filteredRows.length,
    paginatedRows,
    aggregates,
    providerTotals: aggregates.totalsByProvider,
    selectedRow,
    setSelectedRow,
    setFilter,
    setSortField,
    setSortDir,
    setPageSize,
    setCurrentPage,
    fetchData,
    resetControls,
  };
}

