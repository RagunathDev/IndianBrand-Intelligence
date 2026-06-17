import { useState, useEffect, useRef, createContext, useContext } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const DARK = {
  bg: "#0D1117", bg2: "#161B22", bg3: "#1C2330",
  border: "#30363D", text: "#E6EDF3", text2: "#8B949E", text3: "#6E7681",
};
const LIGHT = {
  bg: "#F6F8FA", bg2: "#FFFFFF", bg3: "#F1F3F5",
  border: "#D0D7DE", text: "#1F2328", text2: "#636C76", text3: "#9198A1",
};
const A = {
  saffron: "#FF9933", teal: "#20C997", blue: "#58A6FF",
  green: "#3FB950",   red: "#F85149",  purple: "#A371F7",
};

// ── Data ──────────────────────────────────────────────────────────────────────
const PRODUCT_METRICS = {
  all:   { searches: "2.4M", brands: "14,830", trust: "82.4", sellers: "4,210" },
  inddn: { searches: "1.6M", brands: "9,200",  trust: "88.1", sellers: "—"     },
  ecom:  { searches: "0.8M", brands: "5,630",  trust: "74.6", sellers: "4,210" },
};
const DAYS       = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const VOLS       = [1.8, 2.1, 1.95, 2.3, 2.0, 2.2, 2.4];
const BAR_COLORS = [A.saffron, A.teal, A.blue, A.purple, A.green, A.red, A.saffron];

const TOP_QUERIES = [
  { q: "Tata motors EV",      vol: "48K", up: true  },
  { q: "Amul dairy products", vol: "32K", up: true  },
  { q: "Wipro tech services", vol: "28K", up: false },
  { q: "Patanjali organic",   vol: "21K", up: true  },
  { q: "Reliance Jio plans",  vol: "19K", up: true  },
];
const BRAND_RANKS = [
  { initials:"TA", name:"Tata Group", cat:"Conglomerate", score:94.2, color:A.saffron },
  { initials:"IN", name:"Infosys",    cat:"Technology",   score:91.7, color:A.teal    },
  { initials:"AM", name:"Amul",       cat:"FMCG",         score:89.3, color:A.blue    },
  { initials:"RL", name:"Reliance",   cat:"Diversified",  score:86.1, color:A.purple  },
  { initials:"HD", name:"HDFC Bank",  cat:"Finance",      score:83.9, color:A.green   },
];
const HEALTH_BARS = [
  { label:"INDDN Search",   pct:91, color:A.green   },
  { label:"IndianBrand.in", pct:76, color:A.saffron },
  { label:"NoSTDs.in",      pct:88, color:A.teal    },
  { label:"BrandRank",      pct:83, color:A.blue    },
];
const ECOM_CATS   = ["Electronics","Fashion","Food & Grocery","Home & Living","Health","Books"];
const ECOM_VALS   = [68, 54, 47, 39, 32, 21];
const ECOM_COLORS = [A.saffron, A.teal, A.blue, A.purple, A.green, A.red];

// ── Theme context ─────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ theme: DARK, dark: true });
const useTheme = () => useContext(ThemeCtx);

// ── Primitives ────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  const { theme } = useTheme();
  return (
    <div style={{
      background: theme.bg2, border: `0.5px solid ${theme.border}`,
      borderRadius: 10, padding: 16, ...style,
    }}>
      {children}
    </div>
  );
}

function CardTitle({ label, tag }) {
  const { theme } = useTheme();
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
      <span style={{ fontSize:12, color:theme.text3 }}>{label}</span>
      {tag && (
        <span style={{
          fontSize:10, background:theme.bg3, border:`0.5px solid ${theme.border}`,
          padding:"3px 8px", borderRadius:4, color:theme.text3,
        }}>{tag}</span>
      )}
    </div>
  );
}

function Pill({ children, color }) {
  return (
    <span style={{
      fontSize:10, padding:"3px 8px", borderRadius:4, fontWeight:500,
      background:`${color}22`, color, border:`0.5px solid ${color}55`,
    }}>{children}</span>
  );
}

function Divider({ index, total }) {
  const { theme } = useTheme();
  return index < total - 1
    ? <div style={{ borderBottom:`0.5px solid ${theme.border}` }} />
    : null;
}

// ── MetricCard ────────────────────────────────────────────────────────────────
function MetricCard({ label, value, delta, deltaUp, accentColor }) {
  const { theme } = useTheme();
  return (
    <div style={{
      background: theme.bg2, border:`0.5px solid ${theme.border}`,
      borderRadius:10, padding:"14px 16px",
    }}>
      <div style={{ fontSize:11, color:theme.text3, marginBottom:6, textTransform:"uppercase", letterSpacing:.5 }}>
        {label}
      </div>
      <div style={{ fontSize:22, fontWeight:500, color: accentColor || theme.text }}>
        {value}
      </div>
      <div style={{ fontSize:11, marginTop:4, color: deltaUp ? A.green : A.red }}>
        {deltaUp ? "▲" : "▼"} {delta}
      </div>
    </div>
  );
}

// ── Search volume mini-chart ───────────────────────────────────────────────────
function SearchVolumeChart() {
  const { theme } = useTheme();
  const max = Math.max(...VOLS);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:120 }}>
      {VOLS.map((v, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%" }}>
          <div style={{ flex:1, display:"flex", alignItems:"flex-end", width:"100%" }}>
            <div style={{
              width:"100%",
              height:`${Math.round((v / max) * 100)}%`,
              borderRadius:"3px 3px 0 0",
              background: BAR_COLORS[i],
              opacity: i === 6 ? 1 : 0.6,
              transition:"height .6s ease",
              cursor:"default",
            }} />
          </div>
          <span style={{ fontSize:9, color:theme.text3 }}>{DAYS[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Trust ring ────────────────────────────────────────────────────────────────
function TrustRing({ score = 82 }) {
  const { theme } = useTheme();
  const r    = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%" }}>
      <div style={{ position:"relative", width:110, height:110, margin:"0 auto 12px" }}>
        <svg width="110" height="110" viewBox="0 0 110 110"
          style={{ transform:"rotate(-90deg)" }}
          aria-label={`Trust score ring showing ${score} out of 100`}
          role="img"
        >
          <circle cx="55" cy="55" r={r} fill="none" stroke={theme.border} strokeWidth="8" />
          <circle cx="55" cy="55" r={r} fill="none" stroke={A.saffron}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition:"stroke-dashoffset .8s ease" }}
          />
        </svg>
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)", textAlign:"center",
        }}>
          <div style={{ fontSize:24, fontWeight:500, color:theme.text }}>{score}</div>
          <div style={{ fontSize:10, color:theme.text3 }}>/ 100</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
        <Pill color={A.green}>Authentic ✓</Pill>
        <Pill color={A.green}>Origin verified ✓</Pill>
        <Pill color={A.saffron}>Pricing review</Pill>
        <Pill color={A.blue}>Global reach</Pill>
      </div>
    </div>
  );
}

// ── Top queries ───────────────────────────────────────────────────────────────
function TopQueries() {
  const { theme } = useTheme();
  return (
    <>
      <CardTitle label="Top brand queries" tag="Live" />
      {TOP_QUERIES.map((row, i) => (
        <div key={i}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0" }}>
            <span style={{ fontSize:10, color:theme.text3, width:16 }}>{i + 1}</span>
            <span style={{ flex:1, fontSize:12, color:theme.text }}>{row.q}</span>
            <span style={{ fontSize:11, color:A.saffron, fontWeight:500 }}>{row.vol}</span>
            <span style={{ fontSize:10, color: row.up ? A.green : A.red }}>{row.up ? "▲" : "▼"}</span>
          </div>
          <Divider index={i} total={TOP_QUERIES.length} />
        </div>
      ))}
    </>
  );
}

// ── BrandRank list ────────────────────────────────────────────────────────────
function BrandRankList() {
  const { theme } = useTheme();
  return (
    <>
      <CardTitle label="BrandRank top 5" tag="Today" />
      {BRAND_RANKS.map((b, i) => (
        <div key={i}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0" }}>
            <span style={{ fontSize:11, color:theme.text3, width:18, textAlign:"center" }}>{i + 1}</span>
            <div style={{
              width:28, height:28, borderRadius:6,
              background:`${b.color}22`, color:b.color,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:600,
            }}>{b.initials}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:500, color:theme.text }}>{b.name}</div>
              <div style={{ fontSize:10, color:theme.text3 }}>{b.cat}</div>
            </div>
            <span style={{ fontSize:13, fontWeight:500, color: b.score >= 90 ? A.green : A.saffron }}>
              {b.score}
            </span>
          </div>
          <Divider index={i} total={BRAND_RANKS.length} />
        </div>
      ))}
    </>
  );
}

// ── Product health bars ───────────────────────────────────────────────────────
function ProductHealth() {
  const { theme } = useTheme();
  return (
    <>
      <CardTitle label="Product health" tag="All 4" />
      {HEALTH_BARS.map((h, i) => (
        <div key={i} style={{ marginBottom:10 }}>
          <div style={{
            display:"flex", justifyContent:"space-between",
            fontSize:11, color:theme.text2, marginBottom:4,
          }}>
            <span>{h.label}</span>
            <span style={{ color:h.color }}>{h.pct}%</span>
          </div>
          <div style={{ height:6, background:theme.bg3, borderRadius:3, overflow:"hidden" }}>
            <div style={{
              height:"100%", width:`${h.pct}%`,
              background:h.color, borderRadius:3,
              transition:"width .8s ease",
            }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop:10 }}>
        <div style={{ fontSize:11, color:theme.text3, marginBottom:6, textTransform:"uppercase", letterSpacing:.5 }}>
          Core Web Vitals
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Pill color={A.green}>LCP 1.8s</Pill>
          <Pill color={A.green}>FID 12ms</Pill>
          <Pill color={A.saffron}>CLS 0.09</Pill>
        </div>
      </div>
    </>
  );
}

// ── Chart.js e-commerce bar chart ─────────────────────────────────────────────
function EcomChart({ dark }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!window.Chart || !canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const textColor = dark ? "#8B949E" : "#636C76";
    const gridColor = dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)";

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels:   ECOM_CATS,
        datasets: [{
          label: "Revenue (₹K)",
          data:  ECOM_VALS,
          backgroundColor: ECOM_COLORS,
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color:textColor, font:{ size:10 } },
            grid:  { display:false },
            border:{ display:false },
          },
          y: {
            ticks: { color:textColor, font:{ size:10 }, callback: v => `₹${v}K` },
            grid:  { color:gridColor },
            border:{ display:false },
          },
        },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [dark]);

  return (
    <div style={{ height:140, position:"relative" }}>
      <canvas ref={canvasRef}
        role="img"
        aria-label="Bar chart showing e-commerce revenue by product category"
      />
    </div>
  );
}

// ── Root dashboard ────────────────────────────────────────────────────────────
export default function IndianBrandDashboard() {
  const [dark,    setDark]    = useState(true);
  const [product, setProduct] = useState("all");
  const [chartReady, setChartReady] = useState(false);

  const theme   = dark ? DARK : LIGHT;
  const metrics = PRODUCT_METRICS[product];

  // Load Chart.js once
  useEffect(() => {
    if (window.Chart) { setChartReady(true); return; }
    const s   = document.createElement("script");
    s.src     = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.onload  = () => setChartReady(true);
    document.head.appendChild(s);
  }, []);

  const TABS = [
    { key:"all",   label:"All Products" },
    { key:"inddn", label:"INDDN"        },
    { key:"ecom",  label:"Marketplace"  },
  ];

  return (
    <ThemeCtx.Provider value={{ theme, dark }}>
      <div style={{
        minHeight: "100vh",
        background: theme.bg,
        color:      theme.text,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding:    20,
        transition: "background .25s, color .25s",
      }}>

        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background:A.saffron, display:"flex",
              alignItems:"center", justifyContent:"center",
              fontWeight:700, fontSize:14, color:"#000",
            }}>IB</div>
            <div>
              <div style={{ fontSize:16, fontWeight:500, color:theme.text }}>
                IndianBrand Intelligence
              </div>
              <div style={{ fontSize:11, color:theme.text3 }}>
                Brand Analytics · Search · Health · E-Commerce
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setProduct(t.key)} style={{
                background:   product === t.key ? A.saffron : theme.bg2,
                border:       `0.5px solid ${product === t.key ? A.saffron : theme.border}`,
                color:        product === t.key ? "#000" : theme.text2,
                padding:      "6px 14px",
                borderRadius: 6,
                cursor:       "pointer",
                fontSize:     12,
                fontWeight:   product === t.key ? 500 : 400,
                transition:   "all .2s",
              }}>{t.label}</button>
            ))}
            <button
              onClick={() => setDark(d => !d)}
              title="Toggle dark / light mode"
              style={{
                background: theme.bg2, border:`0.5px solid ${theme.border}`,
                color:theme.text2, padding:"6px 10px",
                borderRadius:6, cursor:"pointer", fontSize:14,
              }}
            >{dark ? "☀️" : "🌙"}</button>
          </div>
        </div>

        {/* Metric cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
          <MetricCard label="Total Searches Today" value={metrics.searches} delta="18.2% vs yesterday" deltaUp />
          <MetricCard label="Brands Indexed"        value={metrics.brands}   delta="312 new today"       deltaUp />
          <MetricCard label="Avg Trust Score"       value={metrics.trust}    delta="1.3 pts this week"   deltaUp accentColor={A.saffron} />
          <MetricCard label="Active Sellers"        value={metrics.sellers}  delta="0.4% churn rate"     deltaUp={false} />
        </div>

        {/* Search chart + Trust ring */}
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:12, marginBottom:12 }}>
          <Card>
            <CardTitle label="Search volume — last 7 days" tag="INDDN" />
            <SearchVolumeChart />
          </Card>
          <Card>
            <CardTitle label="Overall trust score" tag="BrandRank" />
            <TrustRing score={82} />
          </Card>
        </div>

        {/* 3-column panel */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
          <Card><TopQueries /></Card>
          <Card><BrandRankList /></Card>
          <Card><ProductHealth /></Card>
        </div>

        {/* E-commerce chart */}
        <Card style={{ marginBottom:16 }}>
          <CardTitle label="E-commerce category performance" tag="IndianBrand.in" />
          {chartReady
            ? <EcomChart dark={dark} />
            : <div style={{ height:140, display:"flex", alignItems:"center", justifyContent:"center", color:theme.text3, fontSize:12 }}>
                Loading chart…
              </div>
          }
        </Card>

        {/* Footer */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          paddingTop:12, borderTop:`0.5px solid ${theme.border}`,
          fontSize:11, color:theme.text3,
        }}>
          <div>
            <span style={{
              display:"inline-block", width:6, height:6,
              borderRadius:"50%", background:A.green, marginRight:5,
            }} />
            All systems operational · Last updated just now
          </div>
          <div style={{ display:"flex", gap:16 }}>
            <span>4 products live</span>
            <span style={{ color:A.saffron }}>IndianBrand Intelligence Suite v1.0</span>
          </div>
        </div>

      </div>
    </ThemeCtx.Provider>
  );
}
