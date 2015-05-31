package main

import (
    "github.com/gin-gonic/gin"
)


func main() {
    StartGin()
}

func StartGin() {

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
    }

    router.Run(":7777")
}

