// Initialize the map centered on Toronto and set zoom to 11
const map = L.map('map').setView([43.6532, -79.3832], 11);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Optional: Add a marker for City Hall
L.marker([43.6532, -79.3832]).addTo(map)
    .bindPopup('Toronto City Hall')
    .openPopup();
