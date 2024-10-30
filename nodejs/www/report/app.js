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
    osm: osm,
    Esri_WorldImagery: Esri_WorldImagery,
    CartoDB_Positron: CartoDB_Positron,
    roadMap: roadMap,
    satelliteMap: satelliteMap,
    terrainMap: terrainMap,
    hybridMap: hybridMap.addTo(map),
    Esri_WorldStreetMap: Esri_WorldStreetMap
}


var markerGroup = L.layerGroup().addTo(map);
const overlay = {
    "ตำแหน่งบ้าน": markerGroup.addTo(map),
    // "ขอบเขตตำบล": tambon_cm.addTo(map)
}

L.control.layers(basemaps, overlay).addTo(map);

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

function removeRow(gid, button) {
    console.log(gid);
    const table = $('#surveyTable').DataTable();
    const row = $(button).closest('tr');
    table.row(row).remove().draw();
    fetch(`/survey/api/delete/${gid}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                table.row(row).remove().draw();
                alert(`ลบข้อมูลสำเร็จ!`);
            } else {
                alert('Failed to delete row from database.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error deleting the row.');
        });
}
function openModal(gid, mncptname, moo, hno, lat, lng) {
    document.getElementById('gid').value = gid;
    document.getElementById('mncptname').value = mncptname;
    document.getElementById('moo').value = moo;
    document.getElementById('hno').value = hno;
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
    document.getElementById('latlng').value = `${lat}, ${lng}`;

    formModal.show();
}

function updateRow() {
    const gid = document.getElementById('gid').value;
    const newMncptname = document.getElementById('mncptname').value;
    const newMoo = document.getElementById('moo').value;
    const newHno = document.getElementById('hno').value;
    const newLat = parseFloat(document.getElementById('lat').value);
    const newLng = parseFloat(document.getElementById('lng').value);

    fetch(`/survey/api/update/${gid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mncptname: newMncptname,
            moo: newMoo,
            hno: newHno,
            lat: newLat,
            lng: newLng
        })
    })
        .then(response => {
            if (response.ok) {
                $('#surveyTable').DataTable().destroy();
                loadTableData();

                formModal.hide();
            } else {
                alert('Failed to update row in the database.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error updating the row.');
        });
}

function zoomMarker(lat, lng) {
    map.setView([lat, lng], 18);
}

async function loadTableData() {
    try {
        const response = await fetch('/survey/api/getdata');
        const data = await response.json();

        var table = $('#surveyTable').DataTable({
            data: data.data,
            columns: [
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-outline-info mt-1" 
                                data-id="${row.gid}" 
                                onclick="zoomMarker(${row.lat}, ${row.lng})">ซูม</button>
                            <button class="btn btn-outline-warning mt-1" 
                                data-id="${row.gid}" 
                                onclick="openModal(${row.gid}, '${row.mncptname}', ${row.moo}, '${row.hno}', ${row.lat}, ${row.lng})">แก้ไข</button>
                            <button class="btn btn-outline-danger mt-1" 
                                data-id="${row.gid}" 
                                onclick="removeRow(${row.gid}, this)">ลบ</button>`;
                    }
                },
                { data: 'gid' },
                { data: 'mncptname' },
                { data: 'moo' },
                { data: 'hno' },
                { data: 'lat' },
                { data: 'lng' }
            ],
            scrollX: true,
        });

        let filteredData = table.rows({ filter: 'applied' }).data().toArray();
        filteredData.forEach(item => {
            const marker = L.marker([item.lat, item.lng], { name: "marker-green", icon: greenIcon }).addTo(markerGroup);
            marker.bindPopup('ชื่อ: ' + item.mncptname + '<br>หมู่: ' + item.moo + '<br>บ้านเลขที่: ' + item.hno);
        });

        // Update markers on search
        table.on('search.dt', function () {
            let filteredData = table.rows({ search: 'applied' }).data().toArray();

            // Remove existing markers from the map
            markerGroup.clearLayers();

            // Add new markers based on filtered data
            filteredData.forEach(item => {
                const marker = L.marker([item.lat, item.lng], { name: "marker-green", icon: greenIcon }).addTo(markerGroup);
                marker.bindPopup('ชื่อ: ' + item.mncptname + '<br>หมู่: ' + item.moo + '<br>บ้านเลขที่: ' + item.hno);
            });
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTableData();
});


const formModal = new bootstrap.Modal(document.getElementById('formModal'));



