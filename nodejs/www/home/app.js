var map = L.map('map').setView([18.551570505767558, 99.0703012946973], 15);

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 24,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

const CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 24
});

const Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 24,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

const roadMap = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 24,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
});

const satelliteMap = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 24,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
});

const terrainMap = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 24,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
});

const hybridMap = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 24,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
})

const basemaps = {
    "แผนที่ถนน OSM": osm,
    "แผนที่ถนน CartoDB": CartoDB_Positron,
    "แผนที่ถนน Google": roadMap,
    "แผนที่จากดาวเทียม ESRI": Esri_WorldImagery,
    "แผนที่จากดาวเทียม Google": satelliteMap.addTo(map),
    "แผนที่จากดาวเทียม GoogleHybrid": hybridMap,
    "แผนที่ภูมิประเทศ Google": terrainMap,
}

var markerGroup = L.layerGroup().addTo(map);
var bmbound = L.layerGroup().addTo(map);
const overlay = {
    "ตำแหน่งบ้าน": markerGroup.addTo(map),
    "ขอบเขตหมู่บ้าน": bmbound.addTo(map)
}
L.control.layers(basemaps, overlay).addTo(map);

L.geoJSON(bm_bound, {
    style: function (feature) {
        // border color only
        // create unique color for each feature
        var color = feature.properties.color;
        return {
            color: color,
            weight: 2,
            fillOpacity: 0.0,
            dashArray: '5, 5'
        };
        // return {
        //     color: "yellow",
        //     weight: 2,
        //     fillOpacity: 0.0,
        //     dashArray: '5, 5'
        // };
    }
}).addTo(bmbound);

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

// Initialize modals correctly
const insertFormModal = new bootstrap.Modal(document.getElementById('insertFormModal'));
const editFormModal = new bootstrap.Modal(document.getElementById('editFormModal'));
const toast = new bootstrap.Toast(document.getElementById('liveToast'), {
    autohide: true,
    delay: 2000
});

// toast.show();
// get data from server
function getData() {
    fetch('/survey/api/getdata')
        .then(response => response.json())
        .then(data => {
            removeMarker("marker-green");
            markerGroup.clearLayers();
            data.data.forEach(function (item) {
                var marker = L.marker([item.lat, item.lng], { name: "marker-green", icon: greenIcon }).addTo(markerGroup);
                // marker.bindPopup('ชื่อ: ' + item.mncptname + '<br>หมู่: ' + item.moo + '<br>บ้านเลขที่: ' + item.hno);

                marker.on('click', function (e) {
                    console.log(item);
                    document.getElementById('idEdit').value = item.gid;
                    document.getElementById('mncptnameEdit').value = item.mncptname;
                    document.getElementById('mooEdit').value = item.moo;
                    document.getElementById('hnoEdit').value = item.hno;
                    document.getElementById('latlngEdit').value = item.lat + ", " + item.lng;
                    document.getElementById('latEdit').value = item.lat;
                    document.getElementById('lngEdit').value = item.lng;
                    editFormModal.show();
                });
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

function insertData(data) {
    // Send POST request
    fetch('/survey/api/insertdata', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Hide the modal on successful submission
                document.getElementById('toastMessage').innerText = 'เพิ่มข้อมูลเรียบร้อย';
                toast.show();
                insertFormModal.hide();
                // Refresh data on the map
                getData();
                // Clear the form
                document.getElementById('surveyForm').reset();
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting the data.');
        });
}

function updateData(data) {
    // Send PUT request
    fetch('/survey/api/update/' + data.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Refresh data on the map
                getData();
                // Hide the modal on successful submission
                document.getElementById('toastMessage').innerText = 'บันทึกข้อมูลเรียบร้อย';
                toast.show();
                editFormModal.hide();
                // Clear the form
                document.getElementById('surveyFormEdit').reset();
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting the data.');
        });
}

function deleteData() {
    const id = document.getElementById('idEdit').value;
    // Send DELETE request
    fetch('/survey/api/delete/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Refresh data on the map
                getData();
                // Hide the modal on successful deletion
                document.getElementById('toastMessage').innerText = 'ลบข้อมูลเรียบร้อย';
                toast.show();
                editFormModal.hide();
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error deleting the data.');
        });
}

// Show modal when clicking on the map or marker
map.on("click", function (e) {
    removeMarker("marker-red");
    const marker = L.marker(e.latlng, { name: "marker-red", icon: redIcon, draggable: false })
        .addTo(map)
        .bindPopup('คุณคลิกที่พิกัด ' + e.latlng.toString());

    document.getElementById('latlng').value = e.latlng.lat + ", " + e.latlng.lng;
    document.getElementById('lat').value = e.latlng.lat;
    document.getElementById('lng').value = e.latlng.lng;

    insertFormModal.show();
});

document.getElementById('surveyForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Collect form data
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
    insertData(data);
});

// surveyFormEdit submit event
document.getElementById('surveyFormEdit').addEventListener('submit', function (event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const id = formData.get('idEdit');
    const mncptname = formData.get('mncptnameEdit');
    const hno = formData.get('hnoEdit');
    const moo = formData.get('mooEdit');
    const lat = formData.get('latEdit');
    const lng = formData.get('lngEdit');

    const data = {
        id: id,
        mncptname: mncptname,
        moo: moo,
        hno: hno,
        lat: lat,
        lng: lng
    };
    updateData(data);
});


window.onload = function () {
    // lc.start();
    // map.on("click", onclick);
    getData();
}

