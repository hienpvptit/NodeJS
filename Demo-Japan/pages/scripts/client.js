var socket = io.connect();
var num_devices = 3;
var device_selected = 1;
var old_device_selected = 1;
/*
* Socket
*/
socket.on("data/" + country, function (data) {
    data = JSON.parse(data);
    updateChart(data);
});


socket.on("connect", function (data) {
    socket.emit("request_switch_status", JSON.stringify({"country": country, "device": device_selected}));
    socket.emit("request_localeTime", country);
    socket.emit("request_device", JSON.stringify({"country": country, "device": device_selected}));
});

socket.on("response_localeTime", function (data) {
    //timeNow  = new Date(data);
});


socket.on("response_switch_status", function (data) {
    for(var i=1; i<=3; i++) {
        $("#esp" + device_selected + "-" + "switch" + i).bootstrapToggle((data[i - 1] == 1) ? "on" : "off");}
});


socket.on("switch", function (data) {
    data = JSON.parse(data);
    if(data.country==country)
        $("#" + data.id).bootstrapToggle((data.value==true) ? "on":"off");
});


/*
* Change Device
* */

for(var i=1; i<=num_devices; i++) {
    $("#select-device").append("<option>ESP" + i + "</option>");
}

function changeDevice(element){
    device_selected = parseInt($(element)[0].value[$(element)[0].value.length-1]);
    for(var i=1; i<=num_devices; i++){
        $("#esp" + old_device_selected + "-switch" + i)[0].id = "esp" + device_selected + "-switch" + i;
    }
    old_device_selected = device_selected;
    socket.emit("request_switch_status", JSON.stringify({"country": country, "device": device_selected}));
    socket.emit("request_device", JSON.stringify({"country": country, "device": device_selected}));
}


/*
* Chart
* */

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
        if(parseInt(data[i].DEVICE)==device_selected){
            tmp_data.temp.push(data[i].TEMP);
            tmp_data.hum.push(data[i].HUM);
            tmp_data.time.push(data[i].TIME.split(" ")[1]);
        }
    }
    myChart.data.labels = tmp_data.time;
    myChart.data.datasets[0].data = tmp_data.temp;
    myChart.data.datasets[1].data = tmp_data.hum;
    myChart.update();
}

$("#select-country").on("change", function () {
   if($("#select-country")[0].value=="Viet Nam")
       location.replace("/vietnam");
    if($("#select-country")[0].value=="Philippines")
        location.replace("/philippines");
});


/*
* Control device
* */
function switch_onclick(element) {
    var id_switch = "esp" + device_selected + "-" + element.id.split("-")[1];
    socket.emit("switch", JSON.stringify({"country": country, "device": device_selected, "id": id_switch, "value": !$("#"+id_switch)[0].checked}));
}

/*
* Date time
* */
function addZero(num){
    num = parseInt(num);
    return num<10 ? '0'+num : num;
}

if(country=="vietnam") {
    setInterval(function () {
        var timeNow = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'}));
        $("#time-country").html("Time: " + addZero(timeNow.getHours()) + ":" + addZero(timeNow.getMinutes()) + ":" + addZero(timeNow.getSeconds()));
    }, 500);
}

if(country=="philippines") {
    setInterval(function () {
        var timeNow = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Manila'}));
        $("#time-country").html("Time: " + addZero(timeNow.getHours()) + ":" + addZero(timeNow.getMinutes()) + ":" + addZero(timeNow.getSeconds()));
    }, 500);
}
