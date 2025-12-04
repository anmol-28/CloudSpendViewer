// frontend/src/utils/aggregates.js

/**
 * computeAggregates(source)
 * - source: array of records (each record may have fields like cloud, cloud_provider, cost_usd, etc.)
 * Returns: { providersCount, totalSpend, totalRecords, totalsByProvider }
 */
export function computeAggregates(source = []) {
  if (!Array.isArray(source)) source = [];

  let totalSpend = 0;
  const providerSet = new Set();
  const totalsByProvider = { AWS: 0, GCP: 0 };

  for (const r of source) {
    if (!r || typeof r !== "object") continue;

    // support multiple possible provider field names
    const provider = r.cloud ?? r.cloud_provider ?? r.provider ?? null;
    if (provider) providerSet.add(String(provider));

    const cost = Number(r.cost_usd ?? r.cost ?? 0);
    if (!Number.isNaN(cost)) {
      totalSpend += cost;

      const p = String(provider ?? "").toUpperCase();
      if (p.includes("AWS")) totalsByProvider.AWS += cost;
      if (p.includes("GCP")) totalsByProvider.GCP += cost;
    }
  }

  return {
    providersCount: providerSet.size,
    totalSpend,
    totalRecords: source.length,
    totalsByProvider,
  };
}
