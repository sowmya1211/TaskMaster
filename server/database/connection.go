package database

//To connect to local MySQL Database
import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB //Database

func Connect() {
	connection, err := gorm.Open(mysql.Open("root:sqldb@tcp(127.0.0.1:3306)/balkanid"), &gorm.Config{})

	if err != nil {
		panic("Could not connect to the database")
	}
	DB = connection
}
