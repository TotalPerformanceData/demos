
const demos_api = "/demos/api/php";
const public_api = "/json-rpc/v2";
const runners = {}
let last_point = {}
let MC = {}
const races = {};
let ws = null;
let clientKey = null;

const timeRaceFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric'
}).format;


const $sharecode = document.getElementById('sharecode');

const init = async () => {
    const response = await fetch(`${public_api}/status/?date=24h`);
    if (response.status == 200) {
        data = await response.json();
        if (data?.races) {
            document.getElementById('list').append(...data.races.filter(r => r.r1_mtp < 0).map(r => {
                races[r.sc] = r;
                const a = document.createElement('a')
                a.setAttribute('sc', r.sc);
                a.innerText = `${timeRaceFormat(new Date(r.date_formatted))} ${r.venue} ${r.obstacle}`;
                a.setAttribute('href', `#${r.sc}`);
                return a;
            }
            ));
        }
    }
    window.dispatchEvent(new HashChangeEvent("hashchange"));
}

$sharecode.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        window.location.hash = `#${document.getElementById('sharecode').value}`;
    }
})
$sharecode.addEventListener('paste', (e) => {
    window.location.hash = `#${e.clipboardData.getData('text')}`;
})
$sharecode.addEventListener('click', () => {
    document.getElementById('list').style.display = 'block';
})
$sharecode.addEventListener('focus', () => {
    document.getElementById('list').style.display = 'block';
})
$sharecode.addEventListener('blur', () => {
    window.setTimeout(() => document.getElementById('list').style.display = 'none', 100);
})

window.addEventListener('hashchange', function () {
    const m = window.location.hash.match(/^#(\w\w\d{12})$/);
    if (m && m[1]) {
        $sharecode.value = m[1];
        load();
    }
})

async function load() {
    stop_animation();
    const sharecode = $sharecode.value;
    const race = races[sharecode];
    document.querySelector("#title").innerHTML = race ? `<span class="country">${race.country}</span>, ${timeRaceFormat(new Date(race.date_formatted))} - ${race.venue} - ${race.distance.replace(/(^|\s)0\w(\s|$)/g, '$2')}` : 'No such race';
    if (sharecode) {
        clientKey = await get_access_key(sharecode, "history"); // live || history (for testing against past races)
    }
}

init();

document.querySelector("#load").addEventListener("click", () => {
    if (ws) {
        stop_animation();
    } else {
        const sharecode = $sharecode.value;
        start_animation(sharecode);
    }
});

async function get_access_key(sc, mode) {
    const response = await fetch(`${demos_api}/streaming_request.php?sc=${sc}&mode=history`);
    if (response.status == 200) {
        data = await response.json();
        if (data?.clientKey && data?.runners) {
            populate_animation_runners(data);
            return data.clientKey;
        }
    }
}

function stop_animation() {
    ws?.close();
    ws = null;
    $sharecode.removeAttribute('disabled');
    document.querySelector("#load").innerText = 'Run Animation';
}

function start_animation(sc) {
    $sharecode.setAttribute('disabled', true);
    document.querySelector("#load").innerText = 'Stop';
    ws = new WebSocket("wss://stream.tpd.zone/history_1.3");
    ws.addEventListener('message', (event) => {
        try {
            point = JSON.parse(event.data)
            if (point?.status) {
                if (point.status == "connected") {
                    if (clientKey) {
                        ws.send(
                            JSON.stringify({
                                vendorKey: clientKey, // client is the temporary vendor
                                clientKey: clientKey,
                                sc: [sc],
                                inc: ['M', 'RS'],
                                pre_off: 3 // include 3 seconds before off
                            })
                        )
                    } else {
                        console.error('No client Key')
                    }
                }
            }
            if (point?.MC) MC = point.MC
            if (point?.M) {
                update_animation(point)
                last_point = point
            }
        } catch (error) {
            console.log(error)
        }
    })
    ws.addEventListener('error', (event) => { // attempt reconnection
        console.log("Socket Error", JSON.stringify(event));
        ws = null
        setTimeout(() => { start_animation(sc, mode, data) }, 2000)
    })
    ws.addEventListener('close', (event) => {
        console.log("Socket Closed " + JSON.stringify(event), event?.reason);
        document.querySelector("#progress_marker").style.width = "100%";
        stop_animation();
    })
    ws.addEventListener('open', (event) => {
        console.log("Socket connected");
    })
}

function update_animation(data) {

    if (data?.M?.O) { // order array

        //console.table(data?.M?.O)

        if (data.M?.P && MC) document.querySelector("#progress_marker").style.width = ((MC.M.D - data.M.P) * 100 / MC.M.D) + "%";
        document.querySelector("#total_runners_number").innerHTML = data?.M?.O.length

        let v = !last_point.M?.P || !last_point.M?.R || !data.M?.P || !data.M?.R ? "-" : (Math.round((((last_point.M.P - point.M.P) / (point.M.R - last_point.M.R)) * 2)) / 2).toFixed(1);

        document.querySelector("#velocity_value").innerHTML = v;
        document.querySelector("#distance_value").innerHTML = !data.M?.P ? '-' : parseInt(data.M.P);
        document.querySelector("#runtime_minutes_value").innerHTML = !data.M?.R ? '0' : Math.floor(data.M.R / 60)
        document.querySelector("#runtime_seconds_value").innerHTML = !data.M?.R ? '00' : ("0" + parseInt((data.M.R - (60 * Math.floor(data.M.R / 60))))).slice(-2)

        data.M.O.forEach((number, order) => {
            if (runners?.[number]) runners[number].dom.style.right = (order * runners[number].width) + "px";
        })

        if (data?.RS) {
            Object.keys(data.RS).forEach(number => {
                let rs = data.RS[number]
                if (runners?.[parseInt(number)]) runners[parseInt(number)].dom.querySelector(".runner_odds").innerHTML = rs?.S || ""
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
        runners[runner.number] = { dom: cloned, width: cloned.offsetWidth + 4 } // set global cache for runner
        runners[runner.number].dom.style.right = (order * runners[runner.number].width) + "px";
    });
}