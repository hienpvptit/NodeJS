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

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort("COM4", { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

var node_datetime = require("node-datetime");
var datetime = node_datetime.create();
datetime.format("m/d/Y H:M:S");
console.log(new Date(datetime.now()));

parser.on('data', function (data) {

    if(data.indexOf("[Received]")!=-1)
    {
        data = data.split(" ")[1];
        data = data.split("-").join(",");
        data[data.length-1] = '';
        data = data.substring(0, data.length-1);

        var tn = new Date(datetime.now()).toISOString().replace("Z", "");

        var sql = `INSERT INTO sensors(temperature, humidity, co2, gas, time) VALUES(${data},'${tn}')`;

        mysql_query(sql, function (callback) {
            console.log("Inserted data");
        });
    }
});
