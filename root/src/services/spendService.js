/**
 * Fetches the spend rows from the static JSON.
 * Abstracted to keep data access separate from UI components.
 */
export async function fetchSpendRows({ signal } = {}) {
  const response = await fetch("/data/spend.json", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.rows || [];
}

