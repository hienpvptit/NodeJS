import paho.mqtt.client as mqtt
from time import sleep
from random import randint
import json
import sys
from urllib2 import urlopen

# Change device 1-3
device = 1
# Change country vietnam or philippines
country = "philippines"

try:
	country = str(sys.argv[1])
	device = str(sys.argv[2])
	print "**Running with\n\rcountry: %s\n\rdevice: %s\n\r-----------------" %(country, device)
except:
	print "**Running default\n\rcountry: philippines\n\rdevice: 1\n\r-----------------"

def on_connect(client, userdata, flags, rc):
	print "Connected to MQTT-server"
	client.publish("Connect", "ok")

client = mqtt.Client()
client.on_connect = on_connect

client.connect("27.118.21.97", 18010, 60)

try:
	client.loop_start()
	while True:
		response = urlopen('http://api.openweathermap.org/data/2.5/weather?q=Manila,PH&appid=d265da80e10ceb4042a78eec0f26f756')
		html = response.read()
		data = json.loads(html)
		temp = int(data["main"]["temp"]) - 273
		hum  = int(data["main"]["humidity"])
		topic = "esp" + str(device) + "/dht11"
		message = {"country": country, "temp":temp, "hum":hum}
		message = json.dumps(message)
		client.publish(topic, message)
		print "Publish Message:", message
		sleep(5)
except KeyboardInterrupt:
	client.loop_stop()
	print "Disonnect MQTT-server"
