$("body").css("height", $(window).height());
$("body").css("width", $(window).width());
var socket = io.connect();

socket.on("data", function (data) {
   data = JSON.parse(data);
   updateChart(data);
});

$("#switch1").on("change.bootstrapSwitch", function(e) {
    socket.emit("switch", JSON.stringify({"sw1": e.target.checked ? "on" : "off"}))
});

$("#switch2").on("change.bootstrapSwitch", function(e) {
    socket.emit("switch", JSON.stringify({"sw2": e.target.checked ? "on" : "off"}))
});

$("#switch3").on("change.bootstrapSwitch", function(e) {
    socket.emit("switch", JSON.stringify({"sw3": e.target.checked ? "on" : "off"}))
});

/* Chart */
var options = {
    title: {
        display: false,                      // Show title
        text: "Home Weather",               // Text of title
        fontSize: 30,                       // Size of title
        fontColor: ['rgb(0, 255, 0)'],      // Color of title
        fontStyle: "bold"                   // Style of title
    },
    /****/
    scales: {
        /**/
        xAxes : [{                          // Ox
            gridLines : {                   // Grid
                display : false
            },
            ticks: {
                autoSkip: true,
                maxTicksLimit: 20           // Max label show on Chart = 20
            },
            scaleLabel: {                   // Label of Ox
                display: true,
                labelString: "Time",
                fontSize: 20,
                fontColor: ['rgb(128, 128, 128)']
            }
        }],
        /**/
        yAxes: [{                           // Oy
            id: "val_temp",
            position: 'left',
            type: 'linear',
            scaleLabel: {                   // Label of Oy
                display: true,
                labelString: "Temperature",
                fontSize: 20,
                fontColor: ['rgb(255, 0, 0)'],
            },
            ticks: {
                min: 15,
                max: 35
            }
        },
            {
                id: "val_hum",
                position: 'right',
                type: 'linear',
                scaleLabel: {                   // Label of Oy
                    display: true,
                    labelString: "Humidity",
                    fontSize: 20,
                    fontColor: ['rgb(0, 0, 255)']
                }
            }]
    },
    /****/
    elements:{
        point:{
            radius: 0
        }
    },
    animation: {
        duration: 500
    }
};
/*--------------------------------------------------------------------------*/
var ctx = document.getElementById('mychart').getContext('2d');
var myChart = new Chart(ctx, {
    title: "Hear",
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Temperature",
            yAxisID: 'val_temp',
            data: [],
            backgroundColor: ['rgba(255, 255, 255, 0.2)'],
            borderColor: ['rgb(255, 0, 0)'],
            borderWidth: 1
        },
            {
                label: "Humidity",
                yAxisID: 'val_hum',
                data: [],
                backgroundColor: ['rgba(255, 255, 255, 0.2)'],
                borderColor: ['rgb(0, 0, 255)'],
                borderWidth: 1
            },
        ]
    },
    options: options
});


function updateChart(data) {
    var len = data.length;
    var tmp_data = {
        temp: [],
        hum: [],
        time: []
    };

    data.reverse();

    for(var i=0; i<len; i++){
            tmp_data.temp.push(data[i].temperature);
            tmp_data.hum.push(data[i].humidity);
            tmp_data.time.push(data[i].time.split(" ")[1]);
    }
    myChart.data.labels = tmp_data.time;
    myChart.data.datasets[0].data = tmp_data.temp;
    myChart.data.datasets[1].data = tmp_data.hum;
    myChart.update();
}
