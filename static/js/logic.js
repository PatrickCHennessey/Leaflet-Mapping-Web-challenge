//Create a map object
var myMap = L.map("mapid", {
  center: [36.77, -119.4179],
  zoom: 6,
});
function marker_size(mag) {
  return mag * 5;
}
function getColor(i) {
  return i > 5
    ? "#EA2C2C"
    : i > 4
    ? "#EA822C"
    : i > 3
    ? "#EE9C00"
    : i > 2
    ? "#EECC00"
    : i > 1
    ? "#D4EE00"
    : "#98EE00";
}
// Adding tile layer
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(myMap);

//Use this link to get geojson data.
var link =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function (data) {
  L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<h1>" +
          feature.properties.mag +
          "</h1> <hr> <h2>" +
          feature.properties.place +
          "</h2>"
      );
    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: marker_size(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    },
  }).addTo(myMap);
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend");
    var labels = ["Magnitude"];
    var grades = [0, 1, 2, 3, 4, 5];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(grades[i] + 1) +
        '"></i> ' +
        grades[i] +
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
});
