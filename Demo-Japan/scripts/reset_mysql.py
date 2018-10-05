#import pymysql
import pymysql
from time import sleep

#db = pymysql.connect("localhost", "uBox_user", "uBox_pass", "ubox")
# require user for mysql.  "uBox_user"@"localhost" -> pass: "uBox_pass"
# CREATE user "uBox_user"@"localhost" identified by password "uBox_pass"

db = pymysql.connect("localhost", "uBox_user", "uBox_pass", "ubox")
cursor = db.cursor()

try:
        print "1. Drop table"
        print "Running: DROP TABLE vietnam....",
        try:
                cursor.execute("DROP table vietnam")
                db.commit()
                print "100%"
        except:
                print "Running: DROP TABLE philippines....",
        try:
                cursor.execute("DROP table philippines")
                db.commit()
                print "100%"
        except:
                print "Error"

        print "2. Create table"
        country = ["vietnam", "philippines"]
        sql = [0, 0]
        sql[0] = "CREATE TABLE " + country[0] + "(ID int(10) PRIMARY KEY AUTO_INCREMENT, DEVICE int(3) not null, TEMP int(3) not null, HUM int(3) not null, TIME DATETIME not null)"
        sql[1] = "CREATE TABLE " + country[1] + "(ID int(10) PRIMARY KEY AUTO_INCREMENT, DEVICE int(3) not null, TEMP int(3) not null, HUM int(3) not null, TIME DATETIME not null)"
        print "Running: %s...." %sql[0],
        try:
                cursor.execute(sql[0])
                db.commit()
                print "100%"
        except:
                print "Error"
        print "Running: %s...." %sql[1],
        try:
                cursor.execute(sql[1])
                db.commit()
                print "100%"
        except:
                print "Error"


except:
        print "Close DB"
        db.close()
print "Close DB"
db.close()
