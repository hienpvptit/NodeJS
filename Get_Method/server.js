var MQTT = {
    host: "mqtt://localhost",
    port: 1883,
    user: "root",
    passwd: "ktdt1",
    topic: "owntrack"
};
var mqtt = require("mqtt");

var mqtt_client = mqtt.connect(MQTT.host, {
    port: MQTT.port,
    username: MQTT.user,
    password: MQTT.passwd
});

mqtt_client.on("connect", function () {
    console.log("Connected to " + MQTT.host);
});

/*------------------------------------------------------*/
var SERVER = {
    host: "localhost",
    port: 8686
};

var express = require('express');

var app = express();

app.get('/', function(req, res){
    response = {
        lat : req.query.lat,
        lon: req.query.lon
    };
    //console.log(response);
    if(response.lat==undefined || response.lon==undefined)
        res.end("Error");
    try{
        if(Validate(response.lat)){
            response.lat = parseFloat(response.lat);
            response.lon = parseFloat(response.lon);
            mqtt_client.publish(MQTT.topic, JSON.stringify(response));
            res.end(JSON.stringify(response));
        }
        else
            res.end("Error");
    }catch (e) {
        console.log(e.message);
    }
});

function Validate(str) {
    var countDot = 0;
    for(var i=0; i<str.length; i++)
    {
        if(str[i]=='.')
        {
            countDot ++;
            if(countDot==2)
                return false;
        }
        if(str[i]!='0' && str[i]!='1' && str[i]!='2' && str[i]!='3' && str[i]!='4' && str[i]!='5' && str[i]!='6' && str[i]!='7' && str[i]!='8' && str[i]!='9' && str[i]!='.'){
            return false;
        }
    }
    return true;
}

var server = app.listen(SERVER.port, function(){
    console.log("Listen on " + SERVER.host + ":" + SERVER.port);
});