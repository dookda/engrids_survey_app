var map = L.map('map').setView([18.790679983131618, 98.98615363854256], 13);

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

const CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

const Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

const roadMap = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
});

const satelliteMap = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
});

const terrainMap = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
});

const hybridMap = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
})

const bingMaps = L.tileLayer('https://t.ssl.ak.tiles.virtualearth.net/tiles/r{q}?g=129&mkt=en-US&shading=hill&stl=H', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.bing.com/maps">Bing Maps</a>'
});

const basemaps = {
    "แผนที่ถนน OSM": osm,
    "แผนที่ถนน CartoDB": CartoDB_Positron,
    "แผนที่ถนน Google": roadMap,
    "แผนที่จากดาวเทียม ESRI": Esri_WorldImagery,
    "แผนที่จากดาวเทียม Google": satelliteMap.addTo(map),
    "แผนที่จากดาวเทียม Google-ชื่อสถานที่": hybridMap,
    "แผนที่ภูมิประเทศ Google": terrainMap,
}

var markerGroup = L.layerGroup().addTo(map);
const overlay = {
    "ตำแหน่งบ้าน": markerGroup.addTo(map),
    // "ขอบเขตตำบล": tambon_cm.addTo(map)
}
L.control.layers(basemaps, overlay).addTo(map);

var lc = L.control.locate({
    locateOptions: {
        enableHighAccuracy: true
    }
}).addTo(map);

const redIcon = L.icon({
    iconUrl: './../assets/pin_red.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const greenIcon = L.icon({
    iconUrl: './../assets/pin_green.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

function gotoPage(page) {
    window.location.href = "./../" + page + "/index.html";
}

// get data from server
function getData() {
    fetch('/survey/api/getdata')
        .then(response => response.json())
        .then(data => {
            removeMarker("marker-green");
            markerGroup.clearLayers();
            data.data.forEach(function (item) {
                var marker = L.marker([item.lat, item.lng], { name: "marker-green", icon: greenIcon }).addTo(markerGroup);
                marker.bindPopup('ชื่อ: ' + item.mncptname + '<br>หมู่: ' + item.moo + '<br>บ้านเลขที่: ' + item.hno);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error getting the data.');
        });
}

function removeMarker(marker) {
    map.eachLayer(function (layer) {
        if (layer.options.name === marker) {
            map.removeLayer(layer);
        }
    });
}

function onclick(e) {
    removeMarker("marker-red");
    L.marker(e.latlng, { name: "marker-red", icon: redIcon })
        .addTo(map)
        .bindPopup('คุณคลิกที่พิกัด ' + e.latlng.toString());
    // console.log(e.latlng);
    formModal.show();

    document.getElementById('latlng').value = e.latlng.lat + ", " + e.latlng.lng;
    document.getElementById('lat').value = e.latlng.lat;
    document.getElementById('lng').value = e.latlng.lng;
}

lc.start();
map.on("click", onclick);
getData();

document.getElementById('surveyForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const mncptname = formData.get('mncptname');
    const hno = formData.get('hno');
    const moo = formData.get('moo');
    const lat = formData.get('lat');
    const lng = formData.get('lng');

    const data = {
        mncptname: mncptname,
        moo: moo,
        hno: hno,
        lat: lat,
        lng: lng
    };

    // Send POST request using fetch
    fetch('/survey/api/insertdata', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            formModal.hide();
            getData();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting the data.');
        });
});

const formModal = new bootstrap.Modal(document.getElementById('formModal'));



