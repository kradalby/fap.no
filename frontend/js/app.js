'use strict'
var util = require("util")
var servers = require('./servers.js')

var app = (function () {

    var getWSAddress = function () {
        var loc = window.location, wsurl
        if (loc.protocol === "https:") {
            wsurl = "wss:"
        } else {
            wsurl = "ws:"
        }
        wsurl += "//" + loc.host + "/ws"

        return wsurl
    }



    var hideToggle = function (element) {
        if (element.style.display === "none") {
            element.style.display = "block"
        } else {
            element.style.display = "none"
        }
    }


    var updateCollapsible = function () {
        $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }

    var changePage = function () {
        var serversDiv = document.querySelector("#servers")
        var servicesDiv = document.querySelector("#services")
        var serversBtn = document.querySelector("#servers-button")
        var servicesBtn = document.querySelector("#services-button")

        if (this.getAttribute("href") == "#servers") {
            serversBtn.parentNode.className = "active"
            servicesBtn.parentNode.className = ""
            serversDiv.style.display = "block"
            servicesDiv.style.display = "none"
        } else {
            serversBtn.parentNode.className = ""
            servicesBtn.parentNode.className = "active"
            serversDiv.style.display = "none"
            servicesDiv.style.display = "block"
        }

    }

    return {
        init: function () {
            var socket = new WebSocket(getWSAddress())

            var serversBtn = document.querySelector("#servers-button")
            var servicesBtn = document.querySelector("#services-button")

            serversBtn.addEventListener("click", changePage)
            servicesBtn.addEventListener("click", changePage)
            servicesBtn.parentNode.className = "active"

            hideToggle(document.querySelector("#servers"))

            socket.onmessage = function (event) {
                var msg = JSON.parse(event.data)

                console.log(msg.dataType)
                switch(msg.dataType) {
                    case "init":
                        for (var i = 0; i < msg.data.length; i++) {
                            servers.addOrUpdateServer(msg.data[i])
                        }
                        servers.sortServers()
                        updateCollapsible()
                        break
                    case "server":
                        servers.addOrUpdateServer(msg.data)
                        servers.sortServers()
                        updateCollapsible()
                        break
                }

            }
        },
    }

})()

app.init()
