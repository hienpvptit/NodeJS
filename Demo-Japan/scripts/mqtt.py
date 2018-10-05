import paho.mqtt.client as mqtt
import MySQLdb
import json
from datetime import datetime
import pytz
from time import sleep

numOfDevice = 3

try:
	db = MySQLdb.connect(host="localhost", port=3306, user="uBox_user", passwd="uBox_pass", db="ubox")
	cursor = db.cursor()
	print "Connected to mysql"
except:
	print "Connect error to mysql"
	exit(0)

def on_connect(client, userdata, flags, rc):
	for i in range(1, numOfDevice+1):
		MQTT_TOPIC = "esp" + str(i) + "/dht11"
		client.subscribe(str(MQTT_TOPIC), 0)

def on_message(client, userdata, msg):
	topic = msg.topic
	topic = topic.split('/')
	if topic[1]!="dht11":
		return
	if topic[0][:3] == "esp":
		try:
			device = int(topic[0][3])
			if device<1 or device>numOfDevice:
				print "Out Of Num Device"
			val = json.loads(msg.payload)
			temp = int(val["temp"])
			hum = int(val["hum"])
			country = str(val["country"])
			if temp>100 or temp<-100:
				print "Value Error"
				return
			if hum>100 or hum<0:
				print "Value Error"
				return
			if country!="vietnam" and country!="philippines":
				print "Value Error"
				return
			now = datetime.now(pytz.utc)
			if country=="vietnam":
				now = str(now.astimezone(pytz.timezone('Asia/Ho_Chi_Minh'))).split("+")[0]
			if country=="philippines":
				now = str(now.astimezone(pytz.timezone('Asia/Manila'))).split("+")[0]

			sql = "INSERT INTO "+ country +"(DEVICE, TEMP, HUM, TIME) VALUES('%s','%s','%s','%s')" %(device, str(temp), str(hum), now)

			cursor.execute(sql)
			db.commit()
			print "Insert data" + topic[0][-1]
		except:
			print "Insert data Error"

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

def connect_mqtt_server():
	try:
		print "Connecting to mqtt-server...."
		client.connect("27.118.21.97", 18010, 60)
		print "Connected to mqtt:broker:localhost"
	except:
		print "Not connect to mqtt:broker:localhost, ",
		print "Try again...."
		sleep(1)
		connect_mqtt_server()

connect_mqtt_server()

try:
	client.loop_forever()
except KeyboardInterrupt:
	client.loop_stop()
	print "Client Disconnect"
	db.close()
	print "Close Database"
