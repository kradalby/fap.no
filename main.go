package main

import (
	"github.com/gin-gonic/gin"
	"github.com/olahol/melody"
)


var m *melody.Melody
var g G

func main() {
	m = melody.New()
	startGin()
}

func startGin() {

	g = G{}
	g.InitDB()
	g.InitSchema()

	router := gin.New()

	router.LoadHTMLFiles("frontend/index.html")

	router.GET("/", index)
	router.GET("/ws", g.ws)
	router.Static("/static", "frontend/static")

	v1 := router.Group("/api/v1")
	{
		v1.GET("/server/all", g.serverAll)
		v1.POST("/server/update", g.serverUpdate)
	}

	m.HandleConnect(sendAllServersOnConnect)

	router.Run(":7777")
}
