export default function TeamBreakdown({ teamTotals = {}, onTeamClick }) {
  const entries = Object.entries(teamTotals || {});
  if (!entries.length) return null;

  const max = entries.reduce((acc, [, value]) => Math.max(acc, value || 0), 0) || 1;

  const handleClick = (team) => {
    if (!onTeamClick) return;
    onTeamClick(team);
  };

  return (
    <div className="panel" style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>Spend by Team</h3>

      {entries.map(([team, value]) => {
        const widthPct = Math.max(6, Math.round(((value || 0) / max) * 100));

        return (
          <div
            className="breakdown breakdown--clickable"
            key={team || "unknown"}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(team || "Unknown")}
            onKeyDown={(e) => e.key === "Enter" && handleClick(team || "Unknown")}
          >
            <div className="bar-label">{team || "Unknown"}</div>
            <div className="bar">
              {/* Reuse AWS bar color for teams to stay on-brand */}
              <div className="bar-fill aws" style={{ width: `${widthPct}%` }} />
            </div>
            <div className="bar-amount">${Math.round(value || 0)}</div>
          </div>
        );
      })}
    </div>
  );
}


