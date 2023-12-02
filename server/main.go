package main

//Connects to local database and Starts listening on port 8080 - Gets request link and calls Routes to route request accordingly
import (
	"example.com/packages/database"
	"example.com/packages/routes"
)

func main() {
	database.Connect()
	routes.Router()
}
