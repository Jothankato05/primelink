import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getScoreColor, getScoreLabel } from '../data/mockData';

const NIGERIA_CENTER = [9.0, 8.0];
const NIGERIA_ZOOM   = 6;

export default function CommunityMap({ communities, allScores, selectedId, onSelect }) {
  return (
    <div className="w-full h-full rounded-none overflow-hidden relative">
      <MapContainer
        center={NIGERIA_CENTER}
        zoom={NIGERIA_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        {/* Dark CartoDB tiles — no satellite */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {communities.map(c => {
          const scores  = allScores[c.id] ?? {};
          const vals    = Object.values(scores).filter(Boolean);
          const avg     = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 70;
          const color   = getScoreColor(avg);
          const label   = getScoreLabel(avg);
          const isSelected = c.id === selectedId;

          return (
            <CircleMarker
              key={c.id}
              center={[c.lat, c.lng]}
              radius={isSelected ? 18 : 12}
              pathOptions={{
                fillColor:   color,
                color:       isSelected ? '#ffffff' : color,
                weight:      isSelected ? 2.5 : 1,
                fillOpacity: isSelected ? 1 : 0.75,
              }}
              eventHandlers={{ click: () => onSelect(c) }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div style={{
                  background: '#000',
                  border: `1px solid ${color}`,
                  borderRadius: 0,
                  padding: '6px 10px',
                  color: '#F1F5F9',
                  fontSize: 11,
                  lineHeight: 1.5,
                  minWidth: 140,
                }}>
                  <div style={{ fontWeight: 700, color: '#fff', marginBottom: 2 }}>{c.name}</div>
                  <div style={{ color: '#94A3B8', fontSize: 10 }}>{c.state} · {c.population.toLocaleString()} residents</div>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color, fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{avg}</span>
                    <span style={{
                      color,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 1,
                      border: `1px solid ${color}`,
                      padding: '1px 5px',
                    }}>{label.text}</span>
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        border: '1px solid #222',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        <div style={{ fontSize: 8, color: '#475569', fontWeight: 700, letterSpacing: 1.2, marginBottom: 2 }}>
          RISK LEVEL
        </div>
        {[
          { color: '#00C896', label: 'Stable (65–100)' },
          { color: '#F5A623', label: 'Moderate (40–64)' },
          { color: '#FF3A5C', label: 'Critical (0–39)'  },
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
