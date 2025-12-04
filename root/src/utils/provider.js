// Utility helpers related to provider metadata

/**
 * Normalizes cloud provider strings coming from records.
 * @param {Record<string, any>} record
 * @returns {string}
 */
export function getProvider(record) {
  if (!record || typeof record !== "object") return "";
  const raw = record.cloud ?? record.cloud_provider ?? record.provider ?? "";
  return String(raw).toUpperCase();
}

