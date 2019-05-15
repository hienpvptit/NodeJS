const static_data = {
    mysql: {
        host: "localhost",
        port: "3306",
        user: "root",
        password: "",
        database: "thietkengoaivi2019"
    }
};
const mysql = require("mysql");
let mysql_connection;
mysql_connect();
setInterval(function () {
    mysql_query("SELECT * FROM sensors ORDER BY ID DESC LIMIT 50", function(callback){
        io.sockets.emit("data", JSON.stringify(callback));
    });
}, 1000);

function mysql_connect() {
    mysql_connection = mysql.createConnection(static_data.mysql); // Recreate the connection, since
                                                    // the old one cannot be reused.
    mysql_connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(mysql_connect, 2000); // We introduce a delay before attempting to reconnect,
        }
        console.log("Connected MySQL server!!!")// to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    mysql_connection.on('error', function(err) {
        console.log('PROTOCOL_CONNECTION_LOST');
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            mysql_connect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

function mysql_query(sql, callback){
    mysql_connection.query(sql, function(err, result, fields){
        if(err)
            throw err;
        return callback(result);
    });
}
//---------------------------------------------------------------------------
const express = require("express"),
    app = express();

app.use('', express.static(__dirname));
app.get('/',function(req, res){
    res.sendfile(__dirname + '/index.html');
});

let server = require("http").createServer(app).listen(50070, function(){
    console.log("Server Running.....\nListening : localhost:50070");
});

let io = require("socket.io").listen(server);