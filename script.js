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

// create legend
const legend = L.control({ position: "bottomleft" });

legend.onAdd = () => {
  const div = L.DomUtil.create("div", "description");
  L.DomEvent.disableClickPropagation(div);
  const text =
    "<b>Lorem Ipsum</b> Helloo!";
  div.insertAdjacentHTML("beforeend", text);
  return div;
};

legend.addTo(map);

map
  .locate({
    // https://leafletjs.com/reference-1.7.1.html#locate-options-option
    setView: true,
    enableHighAccuracy: true,
  })
  // if location found show marker and circle
  .on("locationfound", (e) => {
    console.log(e);
    // marker
    const marker = L.marker([e.latitude, e.longitude]).bindPopup(
      "Your are here :)"
    );
    // circle
    const circle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
      weight: 2,
      color: "red",
      fillColor: "red",
      fillOpacity: 0.1,
    });
    // add marker
    map.addLayer(marker);
    // add circle
    map.addLayer(circle);
  })
  // if error show alert
  .on("locationerror", (e) => {
    console.log(e);
    alert("Location access denied.");
  });

// https://leafletjs.com/reference-1.7.1.html#control-scale
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);
