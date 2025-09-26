const latLng = [coordinates[1], coordinates[0]];
console.log(coordinates);

var map = L.map('map').setView(latLng, 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var marker = L.marker(latLng).addTo(map);
    