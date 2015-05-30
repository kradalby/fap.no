package main

import (
    "github.com/jinzhu/gorm"
)

type Server struct {
    gorm.Model
    Hostname    string  `sql:unique`
    Public      string
    Internal    string
    OS          string
    Uptime      string
}


