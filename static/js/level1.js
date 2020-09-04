// code for creating Basic Map (Level 1)
console.log("js is loaded")
// Store our API endpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(error, data) {
  if (error) throw error;
  console.log(data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup 
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3> Earthquake: ${feature.properties.place} </h3> 
    <hr> <p> Time: ${feature.properties.time} </p> 
    <hr> <p> Magnitude: ${(feature.properties.mag)} </p>
    <hr> <p> Significance: ${(feature.properties.sig)} </p>`);
  }
  function  chooseColor (feature, latlng) {
    var color = "";
    if (feature.properties.sig > 1000){
      color = "#a50f15";
    }
    else if (feature.properties.sig > 750){
      color = "#de2d26";
    }
    else if (feature.properties.sig > 500){
      color = "#fb6a4a";
    }
    else if (feature.properties.sig > 250){
        color = "#fcae91";
      }
    else {
      color = "#fee5d9";
    }
    return new L.circle(latlng,{
      fillOpacity: 0.4,
      color: color,
      fillColor: color,
      radius: feature.properties.sig * 1000
    })
}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    //pointToLayer: pointToLayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  
    // var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //   maxZoom: 18,
    //   id: "mapbox.dark",
    //   accessToken: API_KEY
    // });
    
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

 // Define a baseMaps object to hold our base layers
 var baseMaps = {
       "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}