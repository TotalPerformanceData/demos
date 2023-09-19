let data = null;
let chart = null;
let animator = null;
let animator_frame = 0;
let runners = {};
let freq = 2000;

var video;
var frames = [];
var recording = false;

fetch("../config.json").then(response => response.json()).then(config => {
    document.querySelector("#version").innerHTML = config.version + " (" + config.date + ") - " + config.status;
})

reset_trans();
document.querySelector("#sharcode").value = localStorage.getItem("runner_charts_sharcode") || '37202305311530';
document.querySelector("#source").value = localStorage.getItem("runner_charts_source") || 'live';
document.querySelector("#position").value = localStorage.getItem("runner_charts_position") || 2;
document.querySelector("#xval").value = localStorage.getItem("runner_charts_xval") || "D";
document.querySelector("#yval").value = localStorage.getItem("runner_charts_yval") || "V";
document.querySelector("#runner_info").value = localStorage.getItem("runner_charts_runner_info") || "V";
document.querySelector("#speed").value = localStorage.getItem("runner_charts_speed") || 1;
document.querySelector("#fade_at").value = localStorage.getItem("runner_charts_fade_at") || 0;
document.querySelector("#zoom").value = localStorage.getItem("runner_charts_zoom") || 0;

document.querySelector("button[id='load']").addEventListener("click", () => {
    get_data();
    localStorage.setItem("runner_charts_sharcode", document.querySelector("#sharcode").value);
    localStorage.setItem("runner_charts_yval", document.querySelector("#yval").value);
    localStorage.setItem("runner_charts_position", document.querySelector("#position").value);
    localStorage.setItem("runner_charts_xval", document.querySelector("#xval").value);
    localStorage.setItem("runner_charts_yval", document.querySelector("#yval").value);
    localStorage.setItem("runner_charts_runner_info", document.querySelector("#runner_info").value);;
    localStorage.setItem("runner_charts_speed", document.querySelector("#speed").value);
    localStorage.setItem("runner_charts_fade_at", document.querySelector("#fade_at").value);
    localStorage.setItem("runner_charts_zoom", document.querySelector("#zoom").value);
});
document.querySelector("button[id='run']").addEventListener("click", () => {
    if(animator) clearInterval(animator);
    animator_frame = 0;
    chart.data.datasets.forEach((dataset, i) => {
        if(chart.data.datasets[i].tag != "par") {
            chart.data.datasets[i].data = [data.points[0]];
        }
        
        chart.options.scales.y.min = 0
    });
    chart.update('none'); // run without animation
    document.querySelector("#animation_container").style.height = 110
    run_animation() 
})
document.querySelector("button[id='stop']").addEventListener("click", () => {
    if(animator) {
        clearInterval(animator);
        animator = null;
        recording = true;
        document.querySelector("button[id='stop']").innerHTML = "RESUME";
    } else {
        run_animation()
        recording = false;
        document.querySelector("button[id='stop']").innerHTML = "STOP";
    }
})
document.querySelector("#speed").addEventListener("change", () => {
    reset_trans()
    if(animator) run_animation(); // restarts with new speed
});
function reset_trans() {
    let speed = document.querySelector("#speed").value
    if(chart) chart.options.animation.duration = freq / speed;
    let trans_elems = [
        document.querySelector("#progress_marker"),
        document.querySelector("#animation_container #par_marker"),
       // ...document.querySelectorAll("#animation_container .runner") // don't speed up runner cards ?
    ];
    trans_elems.forEach(element => {
        if(element) {
            element.style.transitionDuration = ((freq / 1000) / speed).toFixed(2) + "s";
        } 
    });
}
async function get_data() {

    document.querySelector("#animation_container").style.height = 110

    if(animator) clearInterval(animator);
    animator = null;

    let includes = ["V", "O", "B", "D"]
    let ri = document.querySelector("#runner_info").value;
    if(includes.indexOf(ri) == -1) includes.push(ri)

    const url = `${window.location.origin + "/demos/api/php"}/runner_velocities.php?sc=${document.querySelector("#sharcode").value}&source=${document.querySelector("#source").value}&includes=` + includes.join(",");
    const response = await fetch(url);
    data = await response.json();

    document.querySelector("#race_title").innerHTML = '<span style="font-weight: 700">' + data.race.date_time + " " + data.race.venue + "</span><br /><span>" + data?.race?.title + "</span>";

    animator_frame = 0;
    document.querySelector("#animation_container").style.height = 110
    let max_v = populate_animation_runners();
    setup_chart(max_v);
}

function captureFrame() {
    if (!recording) return;

    // html2canvas(document.getElementById('demo_container')).then(function(canvas) {
    //   video.add(canvas);
    //   setTimeout(captureFrame, 50);
    // });

  }

function save_recording() {
    recording = false;
    // video.compile(false, function(output) {
    //     var url = URL.createObjectURL(output);
    //     var downloadLink = document.createElement('a');
    //     downloadLink.href = url;
    //     downloadLink.download = 'recorded_video.webm';
    //     downloadLink.click();
    // })
}

function setup_chart(max_v) {
    if(chart) chart.destroy();
   // Chart.defaults.backgroundColor = '#36A2EB';
    Chart.defaults.borderColor = '#ffffff';
    Chart.defaults.color = '#ffffff';
   // Chart.defaults.defaultFontColor = "#ffffff";
    const xval = document.querySelector("select[id='xval']").value;
    const yval = document.querySelector("select[id='yval']").value;
    const cfg = {
        type: "line",
        data: {
          //  labels: [0, 220, 440, 660, 880, 1100, 1320, 1540, 1760, 1980, 2200, 2395 ], //data.labels[xval], // P = Distance go for leader, R = Run Time
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: function(c,i) {
                if(animator) {
                    animator_frame = Math.round((c.x - c.chart.chartArea.left) * (chart.data.datasets[0].data.length - 1) / c.chart.chartArea.width)

                    chart.data.datasets.forEach((dataset, i) => {
                        if(chart.data.datasets[i].tag != "par") {
                            chart.data.datasets[i].data = data.points.slice(0, animator_frame + 1);
                        }
                    });
                    chart.update('none'); // run without animation
                }
            },
            scales: {
                x: {
                   type: 'linear',
                    title: {
                        display: true,
                        text: xval == "D" ? "Distance" : "Run Time",
                        font: {
                            size: 18,
                            family: "Montserrat"
                        }
                    },
                    border: {
                        display: yval == "VP" ? false : true,
                    },
                    grid: {
                        tickWidth:0,
                        tickLength: 0,
                        drawBorder: false,
                        display: false,
                        color: '#606060',
                        lineWidth: 1
                    },
                    ticks: {
                        min: 0,
                        stepSize: 201.168,
                        font: {
                            size: 14,
                            family: "Montserrat"
                        },
                        minRotation: 45,
                        maxRotation: 45,
                        callback: (value, index, ticks) => {
                            //value = data.labels[xval][index]
                            if(xval == "D") {
                                const yards = ticks.length - 1 == index || index == 0 ? (value * 1.0936133) : Math.round((value * 1.0936133) / 220) * 220
                                const m = Math.floor(yards / 1760);
                                const f = Math.floor((yards - (m * 1760)) / 220);
                                const y = Math.floor(yards - (m * 1760) - (f * 220));
                                return yards == 0 ? "Start" : (m ? `${m}m ` : '') + (f ? `${f}f ` : '') + (y ? `${y}y ` : '')
                            } else {
                                const m = Math.floor(value / 60);
                                const s = ("0" + Math.floor(value - (m * 60))).slice(-2);
                                return (m ? `${m}:` : '0:') + (s ? `${s}` : '')
                            }
                        }
                    },
                    min: Math.max(0, data.points[data.points.length  - 1][xval] - (data.points[data.points.length - 1][xval] / document.querySelector("#zoom").value)),
                    max: data.points[data.points.length - 1][xval]
                },
                y: {
                    //type: 'linear',
                    title: {
                        display: true,
                        text: document.querySelector("select[id='yval'] option:checked").text,
                        font: {
                            size: 18,
                            family: "Montserrat"
                        }
                    },
                    grid: {
                        tickWidth: 0,
                        tickLength: 5,
                        drawBorder: false,
                        display: false,
                        color: '#606060',
                        lineWidth: 1
                    },
                    ticks: {
                        font: {
                            size: 14,
                            family: "Montserrat"
                        },
                        callback: (value, index, ticks) => {
                            return  yval == "V" ? (value * 2.236936).toFixed(0) : value; // m/s to mph
                        }
                    },
                    reverse: yval == "O",
                    min: yval == "V" ? 9 : (yval == "b" ? 0 : (yval == "VP" ? -2 : 0)),
                    max: yval == "V" ? (Math.ceil((max_v * 2.236936) + 0.1) / 2.236936) + 0 : (yval == "B" ? 20 : (yval == "VP" ? 2 : data.runners.length + 1))
                }
            },
            animation: {
                duration: animator ? freq / document.querySelector("#speed").value : 500,
                easing: 'linear',
            },
            elements: {
                point: {
                    radius: 0 // remove points
                }
            },
            plugins: {
                legend: {
                    display: false // adding our own legend for better control 
                },
                annotation: {
                    annotations: {
                        zero: yval == "VP" ? {
                            type: 'line',
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            scaleID: 'y',
                            value: 0
                        } : null
                    }
                }
                /*zoom: {
                    pan: {
                      enabled: true,
                      mode: 'xy',
                      modifierKey: 'ctrl',
                    },
                    zoom: {
                      mode: 'xy',
                      drag: {
                        enabled: true,
                        borderColor: 'rgb(54, 162, 235)',
                        borderWidth: 1,
                        backgroundColor: 'rgba(54, 162, 235, 0.3)'
                      }
                    }
                }*/
            }
        },
        plugins: [{
            beforeInit: function(chart, args, options) {
              // Make sure we're applying the legend to the right chart
              if (chart.canvas.id === "chart") {
                document.getElementById("legend_items").innerHTML = "";
                chart.data.datasets.forEach((label, i) => {

                    if(chart.data.datasets[i]?.label ) {
                        let item = document.createElement("div");
                        item.classList.add("legend_item");
                        item.setAttribute("index", i);
                        item.setAttribute("number", chart.data.datasets[i].number);
                        item.style.opacity = chart.data.datasets[i].hidden ? 0.45 : 1

                        item.innerHTML = `<div class="legend_line" style="background-color: ${ chart.data.datasets[i].backgroundColor }"></div><div class="legend_text">${ chart.data.datasets[i].label }</div><div class="legend_info"></div>`;
                        item.onclick = function(e) {
                            chart.data.datasets[i].hidden = !chart.data.datasets[i].hidden;
                            this.style.opacity = chart.data.datasets[i].hidden ? 0.45 : 1
                            chart.update();
                            
                            if(document.querySelector(".runner[number='" + chart.data.datasets[i].number + "']" ))
                                document.querySelector(".runner[number='" + chart.data.datasets[i].number + "']" ).style.opacity = chart.data.datasets[i].hidden ? 0.45 : 1
                        }
                        document.getElementById("legend_items").appendChild(item);
                    }

                    
                });
        
                return document.getElementById("legend_items")
              }
        
              return;
            }
          }]  
    }; 

    

    if(data?.pars && yval == "V") {

        
        /*
        // par range - make switching patr type optional
        for(let i = 0; i <= data.points.length; i++) {
            if(data.points[i-1]?.P?.V) {
                data.points[i-1].P.L = data.points[i-1].P.V * 0.95;
                data.points[i-1].P.H = data.points[i-1].P.V * 1.05;
            }
        }
        cfg.data.datasets.push({
            data: data.points,
            tag: "par",
            borderWidth: 0,
            hidden: false,
            spanGaps: true,
            lineTension: 0.5,   
            parsing: {
                xAxisKey: xval,
                yAxisKey: 'P.L'
            },
        })    
        cfg.data.datasets.push({
            data: data.points,
            label: "Par Speed",
            tag: "par",
            fill: 0, // fill to dataset 0 = par_low
            borderWidth: 0,
            spanGaps: true,
            lineTension: 0.5,   
            parsing: {
                xAxisKey: xval,
                yAxisKey: 'P.H'
            },
            backgroundColor: "#aaaaaa70"
        }) 
        */

        // this is just a think par line - for reference
        cfg.data.datasets.push({
            data: data.points,
            label: "Par Speed",
            tag: "par",
            borderWidth: 10,
            pointBorderWidth: 1,
            spanGaps: true,
            lineTension: 0.5,   
            parsing: {
                normalized: true,
                xAxisKey: xval,
                yAxisKey: 'P.V'
            },
            borderColor: "#aaaaaa70",
            backgroundColor: "#aaa"
        })

    }
    cfg.data.datasets.push({
        data: data.points,
        label: "Field Average",
        tag: "average",
        hidden: true,
        borderWidth: 10,
        pointBorderWidth: 1,
        spanGaps: true,
        lineTension: 0.5,   
        parsing: {
            normalized: true,
            xAxisKey: xval,
            yAxisKey: "A.V"
        },
        borderColor: "#FFA50070",
        backgroundColor: "#FFA500"
    })

    data.runners.sort((a, b) => (a.position == 0 || a.position == "nf" ? 1000 : a.position) - (b.position == 0 || b.position == "nf" ? 1000 : b.position) ).forEach((runner) => {

        // relative speed to par

        if(yval == "VP") {
            for(let i = 1; i <= data.points.length; i++) {
                if(data.points[i-1][runner.cloth_number]?.V && data.points[i-1]?.P?.V) data.points[i-1][runner.cloth_number].VP = data.points[i-1][runner.cloth_number].V - data.points[i-1].P.V;
            }
        }

        cfg.data.datasets.push({
            data: data.points,
            label: runner.cloth_number + ". " + runner.name + ( runner.position != 0 && runner.position != "nf" ? " (" + runner.position + ")": ""),
            number: runner.cloth_number,
            tag: "runner",
            hidden: runner.position == 0 || runner.position == "nf" || runner.position > parseInt(document.getElementById("position").value),
           // fill: {target: {value: runner.max_velocity * 0.975}, below: "rgba(255, 255, 255, 0)", above: "rgba(255, 0, 0, 0.5)"},
            spanGaps: true,
            lineTension: 0.5,   
            parsing: {
                xAxisKey: xval == "R" ? "R" : runner.cloth_number + "." + xval, // add P's for each runner if Distance is selected?
                yAxisKey: runner.cloth_number + ".V"
            },
            backgroundColor: runner.colour.bg,
            borderColor: runner.colour.bg,
        })
    });

    
    const ctx = document.getElementById("chart");
    chart = new Chart(ctx, cfg);

    /*chart.data.datasets.forEach((dataset, i) => {
        if(chart.data?.datasets?.[i]?.fill?.above) chart.data.datasets[i].fill.above = addTransparency(chart.data.datasets[i].borderColor, 0.5);
    }) 
   
    chart.update();
    */
}
function addTransparency(rgbColor, transparency) {
    // Extract RGB color values
    var rgbValues = rgbColor.match(/\d+/g);
    var r = parseInt(rgbValues[0]);
    var g = parseInt(rgbValues[1]);
    var b = parseInt(rgbValues[2]);
    // Create RGBA color string with transparency
    var rgbaColor = "rgba(" + r + ", " + g + ", " + b + ", " + transparency + ")";
    return rgbaColor;
}

function populate_animation_runners() {
    document.querySelector("#runners_section").innerHTML = "";
    document.querySelector("#race_course_name").innerHTML = data.race.venue + " " + data?.race?.title;
    let max_v = 0
   
    data.runners.forEach((runner, r) => {
        if(data.points[data.points.length - 1]?.[runner.cloth_number]?.O) {
            const cloned = document.querySelector(".runner[number='0']").cloneNode(true);
            cloned.setAttribute("number", runner.cloth_number);
            cloned.querySelector(".runner_number").innerHTML = runner.cloth_number // set attr to be able to add custom data like odds
            cloned.querySelector(".runner_number").style.background = runner.colour.bg;
            cloned.querySelector(".runner_number").style.color = runner.colour.fg;
            cloned.style.display = "flex";
            if(runner?.silk) cloned.querySelector(".silk").setAttribute("src", runner.silk);
            document.querySelector("#runners_section").appendChild(cloned);
            runners[runner.cloth_number] = {dom: cloned, width: cloned.offsetWidth + 4} // set global cache for runner
            runners[runner.cloth_number].dom.style.right = ((data.points[data.points.length - 1][runner.cloth_number].O - 1) * runners[runner.cloth_number].width) + "px";
            cloned.querySelector(".length_behind").innerHTML = data.points[data.points.length - 1][runner.cloth_number].B || "L"
            if(runner.position == 0 || runner.position == "nf" || runner.position > parseInt(document.getElementById("position").value)) {
                cloned.style.opacity = 0.45
            }
            
            max_v = Math.max(max_v, runner.max_velocity)   
        }
       
    });
    return max_v;
}

function update_animation(i) {
    document.querySelector("#progress_marker").style.width = ((data.points[i].D) * 100 / data.points[data.points.length - 1].D) + "%";
    document.querySelector("#total_runners_number").innerHTML = data.runners.length
    let v = (Math.round(data.points[i].V * 2.236936 * 2) / 2).toFixed(1); // leader v
    const p = parseInt(data.points[i].D)
    const m = Math.floor(p / 1760);
    const f = Math.floor((p - (m * 1760)) / 220);
    const y = 0 //Math.floor(p - (m * 1760) - (f * 220));
    const dist = (m ? `${m}m ` : '') + `${f}f` + (y ? `${y}y ` : '')
    const d = parseInt(data.points[i].D)
    if(parseInt(data.points[data.points.length - 1].D) - d < document.querySelector("#fade_at").value && document.querySelector("#fade_at").value != 0) {
        document.querySelector("#animation_container").style.height = 0
    }
    document.querySelector("#velocity_value").innerHTML = v;
    document.querySelector("#distance_value").innerHTML = dist; // parseInt(data.points[i].P);
    document.querySelector("#runtime_minutes_value").innerHTML = Math.floor(data.points[i].R / 60)
    document.querySelector("#runtime_seconds_value").innerHTML = ("0" + parseInt((data.points[i].R  - (60 * Math.floor(data.points[i].R / 60))))).slice(-2)
    let ri = document.querySelector("#runner_info").value
    data.runners.forEach((runner, r) => {
        if(runners?.[runner.cloth_number]) {
            runners[runner.cloth_number].dom.style.right = ((data.points[i][runner.cloth_number].O - 1) * runners[runner.cloth_number].width) + "px";
            runners[runner.cloth_number].dom.querySelector(".length_behind").innerHTML = data.points[i][runner.cloth_number].B || "L"
            let iv = data.points[i][runner.cloth_number]?.[ri];
            if(!iv) {
                // get time 
                let updated_frame_index = runners[runner.cloth_number].updated_frame_index || i
                if(i - updated_frame_index >= 5) { // if not updated for x frames, assume stopped
                    runners[runner.cloth_number].dom.querySelector(".runner_info").innerHTML  = ""
                }
            } else {
                if(ri == "V") iv = (Math.round(iv * 2 * 2.236936) / 2).toFixed(1); // + " mph"
                runners[runner.cloth_number].dom.querySelector(".runner_info").innerHTML = iv
                runners[runner.cloth_number].updated_frame_index = i
            } 

            document.querySelector(".legend_item[number='" + runner.cloth_number + "'] .legend_info").innerHTML = runners[runner.cloth_number].dom.querySelector(".runner_info").innerHTML ;
        }
    })
}

function run_animation() { // CHART ANIMATION 
    frames = [];
    recording = true;
   // video = new Whammy.Video(20, 1);
    captureFrame() 
    
    reset_trans()

    let animation_data = [chart.data.datasets[0].data[0]]

    chart.data.datasets.forEach((dataset, i) => {
        if(chart.data.datasets[i].tag != "par" || document.querySelector("#zoom").value > 1) {
            chart.data.datasets[i].data = animation_data
        }
    });
    chart.update('none'); // run without animation
    
    if(animator) clearInterval(animator);
    animator = setInterval(() => {
        animator_frame++;
        if(!data?.points?.[animator_frame]) {
            clearInterval(animator);
            save_recording();
            return;
        }

        var count = animation_data.length;
        animation_data[count] = animation_data[count - 1]; // sets next point equal to last point
        chart.update('none'); // run without animation

        if(document.querySelector("#zoom").value > 1) {
            const xval = document.querySelector("select[id='xval']").value;

            chart.options.scales.x.max = data.points[chart.data.datasets[1].data.length - 1][xval]
            chart.options.scales.x.min = Math.max(0, data.points[chart.data.datasets[1].data.length - 1][xval] - (data.points[data.points.length - 1][xval] / document.querySelector("#zoom").value))

            const V =  data.points[chart.data.datasets[1].data.length - 1].V
            chart.options.scales.y.min = V - 2
            chart.options.scales.y.max = V + 2
        } else {
            if(document.querySelector("select[id='yval']").value == "V") chart.options.scales.y.min = Math.min(9, Math.max(0, animator_frame - 5))
        }

        animation_data[count] = data.points[count]; // sets next point to actual required point - runs animation from last point (not zero)
        chart.update(); 
        update_animation(animator_frame); 
        
        if(data?.points?.[animator_frame]?.D == 0) {
            clearInterval(animator);
            save_recording()
            return;
        }

        
    }, freq / document.querySelector("#speed").value)
}

