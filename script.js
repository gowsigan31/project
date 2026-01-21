// Approximate coordinates for the center of Toronto [1]
const torontoCoords = [43.6532, -79.3832];
const initialZoom = 12; // Adjust zoom level as needed

// Initialize the map and set its view
const map = L.map('map').setView(torontoCoords, initialZoom);

// Add a tile layer (OpenStreetMap) to the map [2]
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; [OpenStreetMap](www.openstreetmap.org) contributors',
    maxZoom: 19,
}).addTo(map);

// Optional: Add a marker to the center of Toronto [3]
L.marker(torontoCoords).addTo(map)
    .bindPopup('A center point in the City of Toronto.')
    .openPopup();

// obtaining coordinates after clicking on the map
map.on("click", (e) => {
  const markerPlace = document.querySelector(".marker-position");
  markerPlace.textContent = e.latlng;
});
