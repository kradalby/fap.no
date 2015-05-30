package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/jinzhu/gorm"
    _ "github.com/mattn/go-sqlite3"
)

func notYetImplemented(c *gin.Context) {
    c.String(http.StatusOK, "Not yet implemented")
}

func index (c *gin.Context) {
    c.String(http.StatusOK, "nothing yet")
}

func updateServer(c *gin.Context) {
    var server = Server{}
    c.Bind(&server)



}

func main() {
    StartGin()
    StartDB()
}

func StartGin() {
    var api = "/api/v1"
    router := gin.New()

    router.Static("static", "./static")

    router.GET("/", index)
    router.POST(api + "/server/update", updateServer)

    router.Run(":7777")
}

func StartDB () {
    db, err := gorm.Open("sqlite3", "./db.db")

    if err != nil {
        panic("Cannot open database")
    }

    db.DB()
    
    db.Create(&Server{})

}
