function add_zoom_chart(elem, main_chart, config) {

    let config_zoom = _.cloneDeep(config);
    
    config_zoom.options.plugins.legend.display = false
    config_zoom.options.events = ['mousedown', 'mouseup', 'mousemove', 'mouseout'];

    config_zoom.plugins = [{
        id: 'dragger',
        beforeEvent(chart, args, options) {
    
            const handleDrag = function(event) {
                if (chart?.dragger?.element) {
                    switch (event.type) {
                        case 'mousemove':
                            // set mouse cursor
                            if(event.native.buttons == 0) { // in case mouse out of chart area, then mouse up, then mouse back in. Prevents dragging.
                                chart.dragger.lastEvent = undefined;
                                return
                            }
                            return handleElementDragging({x:event.x, y:event.y, o: chart.dragger.lastEvent?.o});
                        case 'mouseout':
                            //if(chart.dragger?.lastEvent) chart.dragger.lastEvent.o = undefined
                        case 'mouseup':
                            // single click = fill whole zoom area
                            if(chart.dragger.lastEvent && chart.dragger.firstEvent && chart.dragger.lastEvent.x == chart.dragger.firstEvent.x && chart.dragger.lastEvent.y == chart.dragger.firstEvent.y) {
                                chart.dragger.element.x2 = chart.scales.x.right
                                chart.dragger.element.x = chart.scales.x.left
                                chart.dragger.element.width = chart.dragger.element.x2 - chart.dragger.element.x
                                chart.dragger.element.centerX = chart.dragger.element.x + chart.dragger.element.width / 2
                            }
                            // only unset if mouse up inside chart, not mouse moves out of chart
                            if(event.native.detail == 1) {
                              chart.dragger.lastEvent = undefined;
                            }      
                            return true;
                        case 'mousedown':
                            if(chart?.dragger?.element) {
                                chart.dragger.lastEvent = {
                                    x: event.x, 
                                    y: event.y, 
                                    o: Math.abs(event.x - chart.dragger.element.x) < 15 ? "x" : (
                                        Math.abs(event.x - chart.dragger.element.x2) < 15 ? "x2" : (
                                            // outside selected area
                                            event.x < chart.dragger.element.x || 
                                            event.x > chart.dragger.element.x2 || 
                                            // selected are is full width so start a new area
                                            (Math.abs(chart.scales.x.left - chart.dragger.element.x) < 5 && Math.abs(chart.scales.x.right - chart.dragger.element.x2) < 5) ? 
                                            "x0" : "x12"
                                        )
                                    )
                                };
                                chart.dragger.firstEvent = {x: chart.dragger.lastEvent.x, y: chart.dragger.lastEvent.y}
                            }
                        break;
                        default:
                    }
                }
            };
    
            const handleElementDragging = function(event) {
                if (!chart?.dragger?.lastEvent || !chart?.dragger?.element) {
                    return;
                }
                
                const move = {x: event.x - chart.dragger.lastEvent.x, y: event.y - chart.dragger.lastEvent.y};
                
                if(chart.dragger.lastEvent?.o == "x") {
            
                    if(chart.dragger.element.x + move.x <= chart.scales.x.left /*|| (chart.dragger?.xLowerMax && chart.dragger.element.x + move.x >= chart.dragger.xLowerMax)*/) {
                        chart.dragger.element.x = chart.scales.x.left
                        chart.dragger.element.width = chart.dragger.element.x2 - chart.dragger.element.x
                        chart.dragger.element.centerX = chart.dragger.element.x + chart.dragger.element.width / 2
                        return true  
                    }
    
                    if(chart.dragger?.xLowerMax && chart.dragger.element.x + move.x >= chart.dragger.xLowerMax) {
                        return // add limit position and return true
                    }
            
                    if(chart.dragger.element.x + move.x > chart.dragger.element.x2) {
                        chart.dragger.element.x = chart.dragger.element.x2
                        chart.dragger.element.width = chart.dragger.element.x2 - chart.dragger.element.x
                        chart.dragger.element.centerX = chart.dragger.element.x + chart.dragger.element.width / 2
            
                        chart.dragger.lastEvent.o = "x2"
                        return true
                    }
            
                    chart.dragger.element.x += move.x;
                    chart.dragger.element.width -= move.x
                    chart.dragger.element.centerX += move.x / 2
                } 
                
                if(chart.dragger.lastEvent?.o == "x2") {
            
                    if(chart.dragger.element.x2 + move.x >= chart.scales.x.right) {
                        chart.dragger.element.x2 = chart.scales.x.right
                        chart.dragger.element.width = chart.dragger.element.x2 - chart.dragger.element.x
                        chart.dragger.element.centerX = chart.dragger.element.x + chart.dragger.element.width / 2
                        return true
                    }
    
                    if (chart.dragger?.xUpperMin && chart.dragger.element.x2 + move.x <= chart.dragger.xUpperMin) {
                        return // add limit position and return true
                    }
            
                    if(chart.dragger.element.x2 + move.x < chart.dragger.element.x) {
                        chart.dragger.element.x2 = chart.dragger.element.x
                        chart.dragger.element.width = chart.dragger.element.x2 - chart.dragger.element.x
                        chart.dragger.element.centerX = chart.dragger.element.x + chart.dragger.element.width / 2
            
                        chart.dragger.lastEvent.o = "x"
                        return true
                    }
            
                    chart.dragger.element.x2 += move.x;
                    chart.dragger.element.width += move.x
                    chart.dragger.element.centerX += move.x / 2
                } 
                
                if(chart.dragger.lastEvent?.o == "x12") {

                    if(chart.dragger.element.x2 + move.x >= chart.scales.x.right) {
                        chart.dragger.element.x2 = chart.scales.x.right
                        chart.dragger.element.x = chart.dragger.element.x2 - chart.dragger.element.width
                        chart.dragger.element.centerX = chart.dragger.element.x + chart.dragger.element.width / 2
                        return true
                    }
    
                    if(chart.dragger.element.x + move.x <= chart.scales.x.left) {
                        chart.dragger.element.x = chart.scales.x.left
                        chart.dragger.element.x2 = chart.dragger.element.x + chart.dragger.element.width
                        chart.dragger.element.centerX = chart.dragger.element.x + chart.dragger.element.width / 2
                        return true
                    }
    
                    chart.dragger.element.x = Math.min(chart.scales.x.right, chart.dragger.element.x + move.x);
                    chart.dragger.element.x2 = Math.max(chart.scales.x.left, chart.dragger.element.x2 + move.x);
    
                    chart.dragger.element.centerX = chart.dragger.element.x + chart.dragger.element.width / 2
                }
    
                if(chart.dragger.lastEvent?.o == "x0") { // new zoom area initiated

                    chart.dragger.element.x = Math.max(chart.scales.x.left, event.x);
                    chart.dragger.element.x2 = Math.min(chart.scales.x.right, event.x);
                    chart.dragger.element.width = 0
                    chart.dragger.element.centerX = chart.dragger.element.x
    
                    chart.dragger.lastEvent.o = move.x < 0 ? "x2" : "x"
                    handleElementDragging(event)

                } else {
    
                    if(chart.dragger.lastEvent?.o) chart.dragger.lastEvent = event;
                }
                
                return true;
            };
                
            if (handleDrag(args.event)) {
                args.changed = true;
    
                // get this from the chart data - otherwise delta_x stuff is broken
                let x_range = chart.scales.x.max - chart.scales.x.min // same as initial main chart scales
                let y_range = chart.scales.y.max - chart.scales.y.min
    
                let w = chart.scales.x.right - chart.scales.x.left
                let x_min = x_range * (chart.dragger.element.x - chart.scales.x.left) / w 
                let x_max = x_range * (chart.dragger.element.x2 - chart.scales.x.left) / w
    
                chart.dragger.mainChart.options.scales.x.min = x_min
                chart.dragger.mainChart.options.scales.x.max = x_max
    
                let y_min = y_range; 
                let y_max = -y_range; 
                let first_x = Math.floor(x_min)
                let last_x = Math.ceil(x_max)
    
                // get the min and max for the y axis for fixed points in the x axis
                chart.config.data.datasets[0].data.forEach((d, i) => {
                    if(d.x >= x_min && d.x <= x_max) {
                        y_min = Math.min(y_min, d.y)
                        y_max = Math.max(y_max, d.y)
                    }
                })
    
                // get min / max for the far left and right of the chart
                // far left
               /* let delta_x = chart.config.data.datasets[0].data[first_x+1].x - chart.config.data.datasets[0].data[first_x].x
                let delta_y = chart.config.data.datasets[0].data[first_x+1].y - chart.config.data.datasets[0].data[first_x ].y
                let slope = delta_y / delta_x
                let x_factor = (x_min - Math.floor(x_min)) / delta_x
                y_min = Math.min(y_min, slope * x_factor + chart.config.data.datasets[0].data[first_x ].y)
                y_max = Math.max(y_max, slope * x_factor + chart.config.data.datasets[0].data[first_x ].y)
    
                // far right
                delta_x = chart.config.data.datasets[0].data[last_x ].x - chart.config.data.datasets[0].data[last_x-1].x
                delta_y = chart.config.data.datasets[0].data[last_x ].y - chart.config.data.datasets[0].data[last_x-1].y
                slope = delta_y / delta_x
                x_factor = (x_max - Math.floor(x_max)) / delta_x
                y_min = Math.min(y_min, slope * x_factor + chart.config.data.datasets[0].data[last_x-1].y)
                y_max = Math.max(y_max, slope * x_factor + chart.config.data.datasets[0].data[last_x-1].y)*/
    
                chart.dragger.mainChart.options.scales.y.min = y_min
                chart.dragger.mainChart.options.scales.y.max = y_max
    
                chart.dragger.mainChart.update("none")
                return;
            }
            
        }
    }]

    if(!config_zoom.options?.plugins) config_zoom.options.plugins = {}
    if(!config_zoom.options?.plugins?.annotation) config_zoom.options.plugins.annotation = {}
    if(!config_zoom.options?.plugins?.annotation?.annotations) config_zoom.options.plugins.annotation.annotations = {
        zoom: {
            display: function (context) {
                return true
            },
            afterDraw: function (context) {
                if(!context.chart?.dragger || context.chart?.dragger?.element?.options.id != context.element.options.id) {
                    context.chart.dragger = {
                        element: context.element,
                        lastEvent: undefined,
                        mainChart: main_chart
                        //xLowerMax: chart.scales.x.left + chart.data.labels.indexOf('March') * (chart.scales.x.right - chart.scales.x.left) /  (chart.data.labels.length - 1) ,
                        //xUpperMin: chart.scales.x.left + chart.data.labels.indexOf('April') * (chart.scales.x.right - chart.scales.x.left) /  (chart.data.labels.length - 1),
                    }
                }
            },
            backgroundColor: '#12345650',
            borderColor: '#aaaaaa50',
            borderWidth: 2,
        // xMax: 'February',
        // xMin: 'June',
            type: 'box', // Create custom annotation type called zoom and control it with the annotations plugin?
            // xLowerMax: 'March', // Add to the annotation plugin and use in the enter function. Need to be able to be updated on the fly
            // xUpperMin: 'April', // Add to the annotation plugin and use in the enter function. Need need to be able to be updated on the fly
        
        }
    }

    main_chart.update();
    
    new Chart(elem, config_zoom);
}
