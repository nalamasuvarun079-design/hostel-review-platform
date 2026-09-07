import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const HostelMap = ({ hostels = [], selectedHostelId = null, height = "400px" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Default center (India center or New Delhi)
    const defaultLat = hostels.length > 0 && hostels[0].coordinates?.lat ? hostels[0].coordinates.lat : 28.6139;
    const defaultLng = hostels.length > 0 && hostels[0].coordinates?.lng ? hostels[0].coordinates.lng : 77.2090;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Create custom pin icon
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background-color: #2563eb; color: white; padding: 6px 10px; border-radius: 20px; font-weight: bold; font-size: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white; display: flex; items-center: center; gap: 4px; white-space: nowrap;">
              <span>🏠</span> Hostel
             </div>`,
      iconSize: [80, 30],
      iconAnchor: [40, 15],
    });

    const activeIcon = L.divIcon({
      className: 'custom-leaflet-marker-active',
      html: `<div style="background-color: #dc2626; color: white; padding: 8px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; box-shadow: 0 6px 10px rgba(0,0,0,0.4); border: 2px solid white; display: flex; items-center: center; gap: 4px; white-space: nowrap;">
              <span>⭐</span> Selected
             </div>`,
      iconSize: [90, 35],
      iconAnchor: [45, 17],
    });

    const bounds = [];

    hostels.forEach((h) => {
      if (h.coordinates && h.coordinates.lat && h.coordinates.lng) {
        const lat = h.coordinates.lat;
        const lng = h.coordinates.lng;
        const isSelected = selectedHostelId === h._id;

        bounds.push([lat, lng]);

        const marker = L.marker([lat, lng], {
          icon: isSelected ? activeIcon : customIcon,
        }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; padding: 2px; width: 180px;">
            <img src="${h.photos && h.photos[0] ? h.photos[0] : ''}" style="width:100%; height:80px; object-fit:cover; border-radius:6px; margin-bottom:6px;" />
            <h4 style="margin:0; font-size:13px; font-weight:bold; color:#111827;">${h.name}</h4>
            <p style="margin:2px 0; font-size:11px; color:#6b7280;">📍 ${h.area}, ${h.city}</p>
            <p style="margin:4px 0 0 0; font-size:12px; font-weight:bold; color:#2563eb;">₹${h.monthlyRent?.min?.toLocaleString()}/mo</p>
            <a href="/hostels/${h._id}" style="display:inline-block; margin-top:6px; font-size:11px; color:white; background:#2563eb; padding:4px 8px; border-radius:4px; text-decoration:none; text-align:center; width:100%; box-sizing:border-box;">View Hostel</a>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      }
    });

    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      } else {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [hostels, selectedHostelId]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default HostelMap;
