


var map = L.map('map').setView([40.71,-73.93], 11);


var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});


map.addLayer(CartoDBTiles);

//create variables 
var neighborhoodsGeoJSON;
var PostOfficeGeoJSON; 

// add Post Office data
$.getJSON( "geojson/PostOffice.geojson", function( data ) {
    var PostOffice = data;

    // make the markers for PostOffice
    var PostOfficePointToLayer = function (feature, latlng){
        var PostOfficeMarker = L.circle(latlng, 150, {
            stroke: true,
            fillColor: '#005ce6',
            fillOpacity: 0.8
        });
        
        return PostOfficeMarker;  
    }

    var PostOfficeClick = function (feature, layer) {
        layer.bindPopup("<strong>Post Office Name:</strong> " + feature.properties.name);
    }

    PostOfficeGeoJSON = L.geoJson(PostOffice, {
        pointToLayer: PostOfficePointToLayer,
        onEachFeature: PostOfficeClick
    }).addTo(map);


});


// neighborhood data
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    var neighborhoods = data;

    var PopStyle = function (feature){
        var value = feature.properties.Pop;
        var fillColor = null;
        if(value >= 0 && value <=1000){
            fillColor = "#ffe5ff";
        }
        if(value >1000 && value <=10000){
            fillColor = "#ffb3ff";
        }
        if(value >10000 && value<=25000){
            fillColor = "#ff80ff";
        }
        if(value > 25000 && value <= 50000){
            fillColor = "#ff00ff";
        }
        if(value > 50000 && value <=100000) { 
            fillColor = "#990099";
        }
        if(value > 100000) { 
            fillColor = "#4d0066";
        }

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };

        return style;
    }

    var PopClick = function (feature, layer) {
        var pop = feature.properties.Pop;
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Population: </strong>" + pop);
    }


    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: PopStyle,
        onEachFeature: PopClick
    }).addTo(map);



    // create layer controls
    createLayerControls(); 

});


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "Post Office": PostOfficeGeoJSON,
        "Neighborhoods Map": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}







