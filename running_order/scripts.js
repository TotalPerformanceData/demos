
const api_domain = window.location.origin + "/demos/api/php";
let runners = {}
let last_point = {}
let MC = {}

fetch("../config.json").then(response => response.json()).then(config => {
    document.querySelector("#version").innerHTML = config.version + " (" + config.date + ") - " + config.status;
})

document.querySelector("button[id='load']").addEventListener("click", () => {
    get_access_key(document.querySelector("#sharecode").value, "history"); // live || history (for testing against past races)
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
        document.querySelector("#progress_marker").style.width = "100%";
        source = null
    }
    source.onmessage = function(event) {
        console.log(event.data)
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

    if(data?.M?.O) { // order array

        console.table(data?.M?.O)

        if(data.M?.P && MC) document.querySelector("#progress_marker").style.width = ((MC.M.D - data.M.P) * 100 / MC.M.D) + "%";
        document.querySelector("#total_runners_number").innerHTML = data?.M?.O.length

        let v =  !last_point.M?.P || !last_point.M?.R || !data.M?.P || !data.M?.R ? "-" : (Math.round((((last_point.M.P - point.M.P) / (point.M.R - last_point.M.R)) * 2))  / 2).toFixed(1);

        document.querySelector("#velocity_value").innerHTML = v;
        document.querySelector("#distance_value").innerHTML = !data.M?.P ? '-' : parseInt(data.M.P);
        document.querySelector("#runtime_minutes_value").innerHTML = !data.M?.R ? '0' : Math.floor(data.M.R / 60)
        document.querySelector("#runtime_seconds_value").innerHTML = !data.M?.R ? '00' : ("0" + parseInt((data.M.R - (60 * Math.floor(data.M.R / 60))))).slice(-2)

        data.M.O.forEach((number, order) => {
            if(runners?.[number]) runners[number].dom.style.right = (order * runners[number].width) + "px";
        })

        if(data?.RS) {
            Object.keys(data.RS).forEach(number => {
                let rs = data.RS[number]
                if(runners?.[parseInt(number)]) runners[parseInt(number)].dom.querySelector(".runner_odds").innerHTML = rs?.S || ""
            }) 
        }
       
    }
    return data?.status;
}

function populate_animation_runners(data) {
    document.querySelector("#runners_section").innerHTML = "";

    data.runners.forEach((runner, order) => {
        const cloned = document.querySelector(".runner[number='0']").cloneNode(true);
        cloned.setAttribute("number", runner.number);
        cloned.querySelector(".runner_number").innerHTML = runner.number // set attr to be able to add custom data like odds
        cloned.style.display = "flex";
        cloned.querySelector(".silk").setAttribute("src", runner.silk);
        document.querySelector("#runners_section").appendChild(cloned);
        runners[runner.number] = {dom: cloned, width: cloned.offsetWidth + 4} // set global cache for runner
        runners[runner.number].dom.style.right = (order * runners[runner.number].width) + "px";
    });
}
