package main

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
)

func notYetImplemented(c *gin.Context) {
    c.String(http.StatusOK, "Not yet implemented")
}

func index (c *gin.Context) {
    c.HTML(http.StatusOK, "index.html", gin.H{})
}

func (g *G) serverUpdate(c *gin.Context) {
    var server = Server{}
    c.Bind(&server)

    server.Public = strings.Split(c.ClientIP(), ":")[0]

    response := g.createOrUpdateServer(server)

    prepareAndDistributeWSData("server", response)
    c.JSON(http.StatusOK, response)
}

func (g *G) serverAll(c *gin.Context) {
    //var servers = []Server{}

    response := g.getAllServers()

    c.JSON(http.StatusOK, response)
}

func (g *G) ws(c *gin.Context) {
    m.HandleRequest(c.Writer, c.Request)
}
