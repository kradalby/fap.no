package main

import (
	"github.com/gin-gonic/gin"
	"github.com/olahol/melody"
)


var m melody.Melody

func main() {
	m = melody.New()
	startGin()
}

func startGin() {

	g := G{}
	g.InitDB()
	g.InitSchema()

	router := gin.New()

	router.Static("static", "./static")

	router.GET("/", index)

	v1 := router.Group("/api/v1")
	{
		v1.GET("/server/all", g.serverAll)
		v1.POST("/server/update", g.serverUpdate)
		v1.GET("/ws", g.ws)
	}

	router.Run(":7777")
}
