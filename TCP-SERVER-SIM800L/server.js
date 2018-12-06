const DATA = {
	HTTP_SERVER: {
		ADDRESS: "80.211.68.147",
        //ADDRESS: "localhost",
		PORT: "8888"
	},
	
	TCP_SERVER: {
		ADDRESS: "80.211.68.147",
        //ADDRESS: "localhost",
		PORT: "9999"
	},

	MYSQL_SERVER: {
		ADDRESS: "localhost",
		PORT: 3306,
		USER: "sim800",
		PASSWD: "sim800",
		DB: "sim800",
		TABLE: "dht11"
	}
};

var dateTime = require('node-datetime');


var mysql = require("mysql");
var db = mysql.createConnection({
    host: DATA.MYSQL_SERVER.ADDRESS,
    port: DATA.MYSQL_SERVER.PORT,
    user: DATA.MYSQL_SERVER.USER,
    password: DATA.MYSQL_SERVER.PASSWD,
    dateStrings: true,
    database: DATA.MYSQL_SERVER.DB
});

function mysql_connect(){
    db.connect(function (err) {
        if(err)
            throw(err);
        console.log("Connected MySQL");
    });
}

function mysql_query(sql, callback){
    db.query(sql, function(err, result, fields){
        if(err)
            throw err;
        return callback(result);
    });
}

function mysql_close(){
    db.end();
    console.log("Disconnected MySQL");
}

mysql_connect();

setInterval(function () {
    mysql_query("SELECT * FROM dht11 ORDER BY ID DESC LIMIT 50", function(callback){
        io.sockets.emit("data", JSON.stringify(callback));
    });
}, 500);


var net = require('net');
var TCP_Clients_List = [];
var TCP_Server = net.createServer();

TCP_Server.listen(DATA.TCP_SERVER.PORT, DATA.TCP_SERVER.ADDRESS, function(){
    console.log('TCP Server is running on port ' + DATA.TCP_SERVER.PORT);
});

TCP_Server.on('connection', function(socket) {
    console.log('Client connected: ' + socket.remoteAddress + ':' + socket.remotePort);
	TCP_Clients_List.push(socket);

	socket.on("data", function (data) {
		data = data.toString();
		data = JSON.parse(data);
		console.log(data);
	        var dt = dateTime.create().format('Y-m-d H:M:S');
        	mysql_query("INSERT INTO dht11(temperature, humidity, time) VALUES(" + data.temperature + "," + data.humidity + ",'" + dt + "')", function(callback){
			console.log(callback);
		});
    });

	socket.on("end", function(){
		TCP_Clients_List.splice(TCP_Clients_List.indexOf(socket), 1);
		console.log('Client disconnected: ' + socket.remoteAddress + ':' + socket.remotePort);
	});
});


var express = require("express"),
    app = express();
	
app.use('/pages', express.static(__dirname + "/pages"));
app.get('/',function(req, res){
    res.sendfile(__dirname + '/pages/html/index.html');
});


var HTTP_Server = require("http").createServer(app).listen(DATA.HTTP_SERVER.PORT, function(){
    console.log("HTTP Server is running on port: " + DATA.HTTP_SERVER.PORT);
});


var io = require("socket.io").listen(HTTP_Server);

io.sockets.on("connection", function (socket) {
    console.log(socket.id + " connected");

	socket.on("switch", function (data) {
        data = data.split(" ").join("");
        data = data.split("\"").join("");
		console.log(data);
        	TCP_Clients_List.forEach(function(sock, index, array) {
        		sock.write(data+"\n");
            });
    });
	
    socket.on("disconnect", function () {
        console.log(socket.id + "disconnect");
    });
});

