export default function HeaderHero() {
  return (
    <div className="header-hero panel" role="banner" aria-label="Cloud Spend header">
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 10,
            background: "linear-gradient(135deg,#FF9900 0%, #111827 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            fontWeight: 800,
            fontSize: 22,
            boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
          }}
          aria-hidden
        >
          ☁
        </div>

        <div>
          <h1 className="header-title">K&Co Cloud Spend Viewer</h1>
          <div className="header-sub">Real-Time Cost Insights and Tracking</div>
        </div>
      </div>
    </div>
  );
}

