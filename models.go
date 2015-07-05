package main

import (
    "log"

    _ "github.com/mattn/go-sqlite3"
    "github.com/jinzhu/gorm"
)

type G struct {
    DB          gorm.DB
}

func (g *G) InitDB() {
    var err error
    g.DB, err = gorm.Open("sqlite3", "./db.db")

    if err != nil {
        log.Fatalf("Got error when opening the database, the error: '%v'", err)
    }

    g.DB.LogMode(true)
}

func (g *G) InitSchema() {
    g.DB.AutoMigrate(&Server{})
}

type Server struct {
    gorm.Model
    Hostname    string  `json:"hostname"`
    Domain      string  `json:"domain"`
    Public      string  `json:"public"`
    Internal    string  `json:"internal"`
    OS          string  `json:"os"`
    Uptime      string  `json:"uptime"`
    Load        string  `json:"load"`
}

func (g *G) getAllServers() []Server {
    servers := []Server{}
    g.DB.Find(&servers)
    return servers
}

func (g *G) getServer(hostname string) Server {
    server := Server{}
    err := g.DB.Where("hostname = ?", hostname).First(&server)

    if err != nil {
        log.Printf("Cannot find '%s', with error: '%v'", err)
    }

    return server
}

func (g *G) createOrUpdateServer(server Server) Server {

    id := g.getServer(server.Hostname).ID

    server.ID = id

    err := g.DB.Save(&server)

    if err != nil {
        log.Printf("Cannot save, with error: '%v'", err)
    }

    return server
}
