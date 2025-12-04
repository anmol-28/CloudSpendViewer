export default function ProviderBreakdown({ awsTotal = 0, gcpTotal = 0 }) {
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

