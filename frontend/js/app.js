'use strict'
var util = require("util")
var moment = require('moment')

var app = (function () {

    var loc = window.location, wsurl
    if (loc.protocol === "https:") {
        wsurl = "wss:"
    } else {
        wsurl = "ws:"
    }
    wsurl += "//" + loc.host + "/ws"

    var socketAddress = wsurl

    var addOrUpdateServer = function (data) {
        var serversDiv = document.querySelector("#servers")

        var isAlreadyAdded = function (hostname) {
            for (var i = 0; i < serversDiv.children.length; i++) {
                if (serversDiv.children[i].id === hostname) {
                    return true
                }
            }
            return false
        }

        var createServerHTML = function (data) {
            var lastUpdate = moment(data.UpdatedAt)
            var html = util.format("<h3>%s</h3>", data.hostname)
            html += "<table>"
            html += util.format("<tr><td>Last update:</td><td>%s</td></tr>", lastUpdate.format('DD-MM-YYYY HH:mm:ss'))
            html += util.format("<tr><td>Operating system:</td><td>%s</td></tr>", data.os)
            html += util.format("<tr><td>Internal IP:</td><td>%s</td></tr>", data.internal)
            html += util.format("<tr><td>Public IP:</td><td>%s</td></tr>", data.public)
            html += util.format("<tr><td>Uptime:</td><td>%s</td></tr>", data.uptime)
            html += "</table>"
            return html
        }

        if (isAlreadyAdded(data.hostname)) {
            var div = document.querySelector("#" + data.hostname)
            div.innerHTML = createServerHTML(data)
        } else {
            var div = document.createElement("div")
            div.id = data.hostname
            div.className = "col s12"
            div.innerHTML = createServerHTML(data)
            serversDiv.appendChild(div)

            div.children[1].style.display = "none"
            div.children[0].addEventListener("click", function (e) {
                hideToggle(div.children[1])
            })


        }


    }

    var hideToggle = function (element) {
        if (element.style.display === "none") {
            element.style.display = "block"
        } else {
            element.style.display = "none"
        }
    }


    return {
        init: function () {
            var socket = new WebSocket(socketAddress)

            socket.onmessage = function (event) {
                var msg = JSON.parse(event.data)
                console.log(msg)

                console.log(msg.dataType)
                switch(msg.dataType) {
                    case "init":
                        console.log(msg.data)
                        for (var i = 0; i < msg.data.length; i++) {
                            addOrUpdateServer(msg.data[i])
                        }
                        break
                    case "server":
                        console.log(msg.data)
                        addOrUpdateServer(msg.data)
                        break
                }

            }
        },
    }

})()

app.init()
