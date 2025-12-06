import awsIcon from '../assets/aws-svgrepo-com.svg';
import gcpIcon from '../assets/gcp-svgrepo-com.svg';

export default function ProviderBreakdown({ awsTotal = 0, gcpTotal = 0, onProviderClick }) {
  const total = awsTotal + gcpTotal || 1;
  const awsPct = Math.round((awsTotal / total) * 100);
  const gcpPct = Math.round((gcpTotal / total) * 100);

  const handleClick = (provider) => {
    if (!onProviderClick) return;
    onProviderClick(provider);
  };

  return (
    <div className="panel" style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>Spend by Provider</h3>

      <div
        className="breakdown breakdown--clickable"
        role="button"
        tabIndex={0}
        onClick={() => handleClick("AWS")}
        onKeyDown={(e) => e.key === "Enter" && handleClick("AWS")}
      >
        <div className="bar-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src={awsIcon} alt="AWS" style={{ width: 16, height: 16, background: '#fff', padding: 1, borderRadius: 4 }} />
          AWS (Amazon)
          <span className="bar-label-meta" style={{ marginLeft: 8, minWidth: 32, textAlign: 'left' }}>{awsPct}%</span>
        </div>
        <div className="bar" style={{ width: '100%' }}>
          <div className="bar-fill aws" style={{ width: `${awsPct}%` }} />
        </div>
        <div className="bar-amount">${awsTotal}</div>
      </div>

      <div
        className="breakdown breakdown--clickable"
        style={{ marginTop: 12 }}
        role="button"
        tabIndex={0}
        onClick={() => handleClick("GCP")}
        onKeyDown={(e) => e.key === "Enter" && handleClick("GCP")}
      >
        <div className="bar-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src={gcpIcon} alt="GCP" style={{ width: 16, height: 16 }} />
          GCP (Google)
          <span className="bar-label-meta" style={{ marginLeft: 8, minWidth: 32, textAlign: 'left' }}>{gcpPct}%</span>
        </div>
        <div className="bar" style={{ width: '100%' }}>
          <div className="bar-fill gcp" style={{ width: `${gcpPct}%` }} />
        </div>
        <div className="bar-amount">${gcpTotal}</div>
      </div>
    </div>
  );
}

