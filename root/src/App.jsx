import React from "react";
import "./index.css";

import HeaderHero from "./components/HeaderHero";
import SummaryBar from "./components/SummaryBar";
import FiltersPanel from "./components/FiltersPanel";
import SpendTable from "./components/SpendTable";
import ProviderBreakdown from "./components/ProviderBreakdown";
import RowDetail from "./components/RowDetail";
import { useSpendData } from "./hooks/useSpendData";

export default function App() {
  const {
    loading,
    error,
    filters,
    sortField,
    sortDir,
    pageSize,
    currentPage,
    totalPages,
    filteredCount,
    paginatedRows,
    aggregates,
    providerTotals,
    selectedRow,
    setSelectedRow,
    setFilter,
    setSortField,
    setSortDir,
    setPageSize,
    setCurrentPage,
    fetchData,
    resetControls,
  } = useSpendData();

  return (
    <div className="app-root">
      <HeaderHero />
      <SummaryBar
        loading={loading}
        error={error}
        providersCount={aggregates.providersCount}
        totalSpend={aggregates.totalSpend}
        totalRecords={aggregates.totalRecords}
      />
      <FiltersPanel
        filters={filters}
        onFilterChange={setFilter}
        sortField={sortField}
        sortDir={sortDir}
        onSortChange={(field, dir) => {
          setSortField(field);
          setSortDir(dir);
        }}
        onReset={resetControls}
        onRefresh={fetchData}
      />
      <div style={{ height: 16 }} />
      <SpendTable
        loading={loading}
        error={error}
        filteredCount={filteredCount}
        paginatedRows={paginatedRows}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageSizeChange={setPageSize}
        onPageChange={setCurrentPage}
        onRowSelect={setSelectedRow}
      />
      <ProviderBreakdown
        awsTotal={Math.round(providerTotals?.AWS || 0)}
        gcpTotal={Math.round(providerTotals?.GCP || 0)}
      />
      <RowDetail row={selectedRow} onClose={() => setSelectedRow(null)} />
    </div>
  );
}
