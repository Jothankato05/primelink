import { Component, useState, useEffect, useRef } from 'react';
import { getScoreColor, getScoreLabel } from '../data/mockData';

const NIGERIA_CENTER = [9.0, 8.0];
const NIGERIA_ZOOM   = 6;

/* ── Error Boundary ────────────────────────────────────────────────────────── */
class MapErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <MapFallback {...this.props} />;
    return this.props.children;
  }
}

/* ── Fallback: simple SVG map when Leaflet fails ───────────────────────────── */
function MapFallback({ communities, allScores, selectedId, onSelect }) {
  const W = 600, H = 500;
  const latRange = [4, 14], lngRange = [2.5, 15];
  const toX = lng => ((lng - lngRange[0]) / (lngRange[1] - lngRange[0])) * (W - 80) + 40;
  const toY = lat => ((latRange[1] - lat) / (latRange[1] - latRange[0])) * (H - 80) + 40;

  return (
    <div className="w-full h-full flex items-center justify-center relative" style={{ background: '#0a1628' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full max-w-[800px]">
        {/* Grid lines */}
        {[0,1,2,3,4].map(i => (
          <line key={`h${i}`} x1="20" y1={40 + i * (H-80)/4} x2={W-20} y2={40 + i * (H-80)/4}
            stroke="#1a2e4a" strokeWidth="0.5" />
        ))}
        {/* Community markers */}
        {communities.map(c => {
          const scores = allScores[c.id] ?? {};
          const vals = Object.values(scores).filter(Boolean);
          const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 70;
          const color = getScoreColor(avg);
          const isSelected = c.id === selectedId;
          const cx = toX(c.lng), cy = toY(c.lat);
          return (
            <g key={c.id} onClick={() => onSelect(c)} style={{ cursor: 'pointer' }}>
              {/* Glow */}
              <circle cx={cx} cy={cy} r={isSelected ? 22 : 16} fill={color} opacity={0.15} />
              {/* Marker */}
              <circle cx={cx} cy={cy} r={isSelected ? 12 : 8}
                fill={color} fillOpacity={isSelected ? 1 : 0.75}
                stroke={isSelected ? '#fff' : color} strokeWidth={isSelected ? 2 : 0.5} />
              {/* Score label */}
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                fill="#fff" fontSize={isSelected ? 8 : 7} fontWeight="700">{avg}</text>
              {/* Name label */}
              <text x={cx} y={cy + (isSelected ? 22 : 18)} textAnchor="middle"
                fill="#94A3B8" fontSize="7" fontWeight="500">{c.name}</text>
            </g>
          );
        })}
        {/* Nigeria label */}
        <text x={W/2} y={H/2} textAnchor="middle" fill="#1a2e4a" fontSize="36" fontWeight="900"
          style={{ letterSpacing: 8 }}>NIGERIA</text>
      </svg>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 10,
        background: 'rgba(0,0,0,0.85)', border: '1px solid #222', padding: '8px 12px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ fontSize: 8, color: '#475569', fontWeight: 700, letterSpacing: 1.2, marginBottom: 2 }}>RISK LEVEL</div>
        {[
          { color: '#00C896', label: 'Stable (65–100)' },
          { color: '#F5A623', label: 'Moderate (40–64)' },
          { color: '#FF3A5C', label: 'Critical (0–39)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#94A3B8' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Leaflet Map (lazy loaded) ─────────────────────────────────────────────── */
function LeafletMap({ communities, allScores, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);
  const [ready, setReady] = useState(false);

  // Dynamically import leaflet (avoids SSR / bundling issues)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        if (cancelled || !containerRef.current) return;

        const map = L.map(containerRef.current, {
          center: NIGERIA_CENTER,
          zoom: NIGERIA_ZOOM,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: false,
        });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
        }).addTo(map);

        mapRef.current = map;
        setReady(true);
      } catch (err) {
        console.warn('[CommunityMap] Leaflet init failed, using fallback:', err.message);
      }
    })();
    return () => { cancelled = true; if (mapRef.current) mapRef.current.remove(); };
  }, []);

  // Update markers whenever data changes
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const L = window.L || require('leaflet');
    const map = mapRef.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    communities.forEach(c => {
      const scores = allScores[c.id] ?? {};
      const vals   = Object.values(scores).filter(Boolean);
      const avg    = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 70;
      const color  = getScoreColor(avg);
      const label  = getScoreLabel(avg);
      const isSelected = c.id === selectedId;

      const marker = L.circleMarker([c.lat, c.lng], {
        radius:      isSelected ? 18 : 12,
        fillColor:   color,
        color:       isSelected ? '#ffffff' : color,
        weight:      isSelected ? 2.5 : 1,
        fillOpacity: isSelected ? 1 : 0.75,
      }).addTo(map);

      marker.bindTooltip(`
        <div style="background:#000;border:1px solid ${color};padding:6px 10px;color:#F1F5F9;font-size:11px;line-height:1.5;min-width:140px">
          <div style="font-weight:700;color:#fff;margin-bottom:2px">${c.name}</div>
          <div style="color:#94A3B8;font-size:10px">${c.state} · ${c.population.toLocaleString()} residents</div>
          <div style="margin-top:4px;display:flex;align-items:center;gap:6px">
            <span style="color:${color};font-weight:700;font-size:18px;line-height:1">${avg}</span>
            <span style="color:${color};font-size:9px;font-weight:700;letter-spacing:1px;border:1px solid ${color};padding:1px 5px">${label.text}</span>
          </div>
        </div>
      `, { direction: 'top', offset: [0, -8], opacity: 1, className: '' });

      marker.on('click', () => onSelect(c));
      markersRef.current.push(marker);
    });
  }, [ready, communities, allScores, selectedId, onSelect]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)', border: '1px solid #222', padding: '8px 12px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ fontSize: 8, color: '#475569', fontWeight: 700, letterSpacing: 1.2, marginBottom: 2 }}>RISK LEVEL</div>
        {[
          { color: '#00C896', label: 'Stable (65–100)' },
          { color: '#F5A623', label: 'Moderate (40–64)' },
          { color: '#FF3A5C', label: 'Critical (0–39)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#94A3B8' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Export: try Leaflet, fall back to SVG ──────────────────────────────────── */
export default function CommunityMap(props) {
  return (
    <MapErrorBoundary {...props}>
      <LeafletMap {...props} />
    </MapErrorBoundary>
  );
}
