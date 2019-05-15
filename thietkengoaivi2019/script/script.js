$(document).ready(function () {
    var socket = io.connect();

    socket.on("data", function (data) {
        data = JSON.parse(data);
        console.log(data);
        updateChart(data);
    });

    let option = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: false,
        },
        elements:{
            point:{
                radius: 2
            }
        },
        animation: {
            duration: 2000
        }
    };

    let ctx;
    ctx = document.getElementById('canvas-temperature').getContext('2d');
    let tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature',
                data: [],
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgb(255, 0, 0)',
                borderWidth: 1
            }]
        },
        options: option
    });
    //------------------------------------------------------------------------------------
    ctx = document.getElementById('canvas-humidity').getContext('2d');
    var humChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity',
                data: [],
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderColor: 'rgb(0, 0, 255)',
                borderWidth: 1
            }]
        },
        options: option
    });
    //------------------------------------------------------------------------------------
    ctx = document.getElementById('canvas-co2').getContext('2d');
    let co2Chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CO2',
                data: [],
                backgroundColor: 'rgba(255, 0, 255, 0.2)',
                borderColor: 'rgb(255, 0, 255)',
                borderWidth: 1
            }]
        },
        options: option
    });
    //------------------------------------------------------------------------------------
    ctx = document.getElementById('canvas-gas').getContext('2d');
    let gasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Gas',
                data: [],
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: 'rgb(0, 255, 0)',
                borderWidth: 1
            }]
        },
        options: option
    });
    //------------------------------------------------------------------------------------
    function updateChart(data) {
        let len = data.length;
        let tmp_data = {
            temp: [],
            hum: [],
            co2: [],
            gas: [],
            time: []
        };

        data.reverse();

        for(let i=0; i<len; i++){
            tmp_data.temp.push(data[i].temperature);
            tmp_data.hum.push(data[i].humidity);
            tmp_data.co2.push(data[i].co2);
            tmp_data.gas.push(data[i].gas);
            tmp_data.time.push(data[i].time.split("T")[1].split(".")[0]);
        }
        tempChart.data.labels = tmp_data.time;
        humChart.data.labels = tmp_data.time;
        co2Chart.data.labels = tmp_data.time;
        gasChart.data.labels = tmp_data.time;

        tempChart.data.datasets[0].data = tmp_data.temp;
        humChart.data.datasets[0].data = tmp_data.hum;
        co2Chart.data.datasets[0].data = tmp_data.co2;
        gasChart.data.datasets[0].data = tmp_data.gas;

        tempChart.update();
        humChart.update();
        co2Chart.update();
        gasChart.update();
    }



});