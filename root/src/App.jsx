import React from "react";
import "./index.css";

import HeaderHero from "./components/HeaderHero";
import SummaryBar from "./components/SummaryBar";
import FiltersPanel from "./components/FiltersPanel";
import SpendTable from "./components/SpendTable";
import ProviderBreakdown from "./components/ProviderBreakdown";
import TeamBreakdown from "./components/TeamBreakdown";
import SegmentDetailModal from "./components/SegmentDetailModal";
import RowDetail from "./components/RowDetail";
import { useSpendData } from "./hooks/useSpendData";
import { getProvider } from "./utils/provider";

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
    filteredRows,
    paginatedRows,
    aggregates,
    providerTotals,
    teamTotals,
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

  const [segmentDetail, setSegmentDetail] = React.useState(null);

  const handleProviderClick = (providerOrNull) => {
    if (!providerOrNull) {
      setSegmentDetail(null);
      return;
    }

    const subset = filteredRows.filter((row) => getProvider(row) === providerOrNull);
    const totalSpend = subset.reduce((sum, r) => {
      const raw = r.cost_usd ?? r.cost ?? 0;
      return sum + Number(raw || 0);
    }, 0);
    const percentOfTotal =
      aggregates.totalSpend > 0 ? (totalSpend / aggregates.totalSpend) * 100 : 0;

    const teamSet = new Set();
    const serviceSet = new Set();
    subset.forEach((r) => {
      if (r.team) teamSet.add(r.team);
      if (r.service) serviceSet.add(r.service);
    });

    setSegmentDetail({
      title:
        providerOrNull === "AWS"
          ? "AWS spend insight"
          : "GCP spend insight",
      description:
        "Based on the currently filtered rows, this segment shows how much of your spend flows into this cloud provider.",
      totalSpend,
      percentOfTotal,
      records: subset.length,
      teamsCount: teamSet.size,
      servicesCount: serviceSet.size,
    });
  };

  const handleTeamClick = (teamOrNull) => {
    if (!teamOrNull) {
      setSegmentDetail(null);
      return;
    }

    const subset = filteredRows.filter((row) => (row.team || "Unknown") === teamOrNull);
    const totalSpend = subset.reduce((sum, r) => {
      const raw = r.cost_usd ?? r.cost ?? 0;
      return sum + Number(raw || 0);
    }, 0);
    const percentOfTotal =
      aggregates.totalSpend > 0 ? (totalSpend / aggregates.totalSpend) * 100 : 0;

    const providerSet = new Set();
    const serviceSet = new Set();
    subset.forEach((r) => {
      providerSet.add(getProvider(r) || "N/A");
      if (r.service) serviceSet.add(r.service);
    });

    setSegmentDetail({
      title: `Team "${teamOrNull}" insight`,
      description:
        "Snapshot of how this team contributes to your current filtered cloud spend.",
      totalSpend,
      percentOfTotal,
      records: subset.length,
      teamsCount: 1,
      servicesCount: serviceSet.size,
      additionalProviders: Array.from(providerSet),
    });
  };

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
        onProviderClick={handleProviderClick}
      />
      <TeamBreakdown teamTotals={teamTotals} onTeamClick={handleTeamClick} />
      <RowDetail row={selectedRow} onClose={() => setSelectedRow(null)} />
      <SegmentDetailModal
        segment={segmentDetail}
        onClose={() => setSegmentDetail(null)}
      />
    </div>
  );
}
