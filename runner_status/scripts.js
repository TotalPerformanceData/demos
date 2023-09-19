
const api_domain = window.location.origin + "/demos/api/php";
let runners = {}
let last_point = {}
let MC = {}
var map = null
var runner_maps = {} 

if (typeof(mapboxgl) == 'object') {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGV2ZWxzb2Z0IiwiYSI6ImNraWthNzZvNTA2YjcydHFxczVwMGYycmIifQ.MvDSKuWJ5xokl7da75susw';
}

fetch("../config.json").then(response => response.json()).then(config => {
    document.querySelector("#version").innerHTML = config.version + " (" + config.date + ") - " + config.status;
})

document.querySelector("button[id='load']").addEventListener("click", () => {
    get_access_key(document.querySelector("#sharecode").value, "history"); // live || history (for testing against past races)
});

document.querySelector("button[id='stop']").addEventListener("click", () => {
    if(source) source.close()
});

async function get_access_key(sc, mode) {
    const response = await fetch(`${api_domain}/streaming_request.php?sc=${sc}&mode=${mode}`);
    if (response.status == 200) {
        data = await response.json();
        if(data?.clientKey && data?.runners) {
            populate_animation_runners(data)
            start_animation(sc, mode, data)
        }
    }
}

function start_animation(sc, mode, data) {
    source = new WebSocket("wss://stream.tpd.zone/" + (mode == "live" ? "realtime" : "history") + "_1.3");
    source.onerror = function(event) { // attempt reconnection
        console.log("Socket Error", JSON.stringify(event));
        source = null
        if(!connection || connection.readyState != 1) {
            setTimeout(() => {start_animation(data)}, 2000)
        }
    }
    source.onclose = function(event) {
        console.log("Socket Closed " + JSON.stringify(event), event?.reason);
        source = null
    }
    source.onmessage = function(event) {
       // console.log(event.data)
        try {
            point = JSON.parse(event.data)
            if(point?.status) {
                if(point.status == "connected") {
                    source.send(
                        JSON.stringify({
                            vendorKey: data.clientKey, // client is the temporary vendor
                            clientKey: data.clientKey, 
                            sc: [sc],
                            inc: ['M', 'RS'],
                            pre_off: 30 // include 30 seconds before off
                        })
                     ) 
                 }
            }
            if(point?.MC) MC = point.MC
            if(point?.M) {
                update_animation(point)
                last_point = point
            }
        } catch (error) {
            console.log(error)
        }
    }
}

function update_animation(data) {
    if(data?.RS) {

        if(!map) {
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/levelsoft/ckjwpx0i111ur17pc2qe4ap6p',
                center: data.RS[Object.keys(data.RS)[0]].LL,
                zoom: 20,
                bearing: 0,
                pitch: 0,
                attributionControl: false
            });
            Object.keys(data.RS).forEach(number => {

                var el = document.createElement('div');
                el.className = 'map_marker silks_' + number.replace(/^0+/, '');
                el.innerHTML = number.replace(/^0+/, '')
                runner_maps[number] = {
                    marker: new mapboxgl.Marker(el).setLngLat(data.RS[number].LL).addTo(map)
                }
            })

            MC?.M?.SL?.LD?.forEach(function(coord) {
                var sl = document.createElement('div');
                sl.className = 'start_point LD';
                new mapboxgl.Marker(sl).setLngLat(coord).addTo(map);
            });
            MC?.M?.SL?.LG?.forEach(function(coord) {
                var sl = document.createElement('div');
                sl.className = 'start_point LG';
                new mapboxgl.Marker(sl).setLngLat(coord).addTo(map);
            });
            MC?.M?.SL?.AP?.forEach(function(coord) {
                var sl = document.createElement('div');
                sl.className = 'start_point AP';
                new mapboxgl.Marker(sl).setLngLat(coord).addTo(map);
            });
            
        } else {
            map.jumpTo({
                center: data.RS[Object.keys(data.RS)[0]].LL
            })
        }

        Object.keys(data.RS).forEach(number => {
            let rs = data.RS[number]
            let row = document.querySelector("tr[number='" + parseInt(number) + "']")
            if(row) {
                row.querySelector(".dt").innerHTML = rs?.DT || ""
                row.querySelector(".ds").innerHTML = rs?.DS || ""
                row.querySelector(".as").innerHTML = rs?.AS || ""
                row.querySelector(".vs").innerHTML = rs?.VS || ""
                row.querySelector(".status").innerHTML = rs?.S || ""
            }

            if(map && rs?.LL && runner_maps?.[number]) runner_maps[number].marker.setLngLat(rs.LL);

        }) 
    }

}

function populate_animation_runners(data) {
    document.querySelector("#tbl tbody").innerHTML = "";
    document.querySelector("#map").innerHTML = "";
    map = null
    runner_maps = {} 

    data.runners.forEach((runner, order) => {
        // add to table
        let tr = document.createElement("tr");
        tr.setAttribute("number", runner.number);

        tr.innerHTML = `
            <td>${runner.number}</td>
            <td><img src='${runner.silk}'></img></td>
            <td class="dt"></td>
            <td class="ds"></td>
            <td class="as"></td>
            <td class="vs"></td>
            <td class="status"></td>
        `;
        document.querySelector("#tbl tbody").appendChild(tr);

    });

}