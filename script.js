// Approximate coordinates for the center of Toronto [1]
const torontoCoords = [43.6532, -79.3832];
const initialZoom = 12; // Adjust zoom level as needed
L.control.zoom({ position: "topright" }).addTo(map);

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

// create custom button
const customControl = L.Control.extend({
  // button position
  options: {
    position: "topleft",
    className: "locate-button leaflet-bar",
    html: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>',
    style:
      "margin-top: 0; left: 0; display: flex; cursor: pointer; justify-content: center; font-size: 2rem;",
  },

  // method
  onAdd: function (map) {
    this._map = map;
    const button = L.DomUtil.create("div");
    L.DomEvent.disableClickPropagation(button);

    button.title = "locate";
    button.innerHTML = this.options.html;
    button.className = this.options.className;
    button.setAttribute("style", this.options.style);

    L.DomEvent.on(button, "click", this._clicked, this);

    return button;
  },
  _clicked: function (e) {
    L.DomEvent.stopPropagation(e);

    // this.removeLocate();

    this._checkLocate();

    return;
  },
  _checkLocate: function () {
    return this._locateMap();
  },

  _locateMap: function () {
    const locateActive = document.querySelector(".locate-button");
    const locate = locateActive.classList.contains("locate-active");
    // add/remove class from locate button
    locateActive.classList[locate ? "remove" : "add"]("locate-active");

    // remove class from button
    // and stop watching location
    if (locate) {
      this.removeLocate();
      this._map.stopLocate();
      return;
    }

    // location on found
    this._map.on("locationfound", this.onLocationFound, this);
    // locataion on error
    this._map.on("locationerror", this.onLocationError, this);

    // start locate
    this._map.locate({ setView: true, enableHighAccuracy: true });
  },
  onLocationFound: function (e) {
    // add circle
    this.addCircle(e).addTo(this.featureGroup()).addTo(map);

    // add marker
    this.addMarker(e).addTo(this.featureGroup()).addTo(map);

    // add legend
  },
  // on location error
  onLocationError: function (e) {
    this.addLegend("Location access denied.");
  },
  // feature group
  featureGroup: () => new L.FeatureGroup(),
  // add legend
  addLegend: function (text) {
    const checkIfDescriotnExist = document.querySelector(".description");

    if (checkIfDescriotnExist) {
      checkIfDescriotnExist.textContent = text;
      return;
    }

    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "description");
      L.DomEvent.disableClickPropagation(div);
      const textInfo = text;
      div.insertAdjacentHTML("beforeend", textInfo);
      return div;
    };
    legend.addTo(this._map);
  },
  addCircle: ({ accuracy, latitude, longitude }) =>
    L.circle([latitude, longitude], accuracy / 2, {
      className: "circle-test",
      weight: 2,
      stroke: false,
      fillColor: "#136aec",
      fillOpacity: 0.15,
    }),
  addMarker: ({ latitude, longitude }) =>
    L.marker([latitude, longitude], {
      icon: L.divIcon({
        className: "located-animation",
        iconSize: L.point(17, 17),
        popupAnchor: [0, -15],
      }),
    }).bindPopup("Your are here :)"),
  removeLocate: function () {
    this._map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        const { icon } = layer.options;
        if (icon?.options.className === "located-animation") {
          map.removeLayer(layer);
        }
      }
      if (layer instanceof L.Circle) {
        if (layer.options.className === "circle-test") {
          map.removeLayer(layer);
        }
      }
    });
  },
});

// adding new button to map controll
map.addControl(new customControl());
