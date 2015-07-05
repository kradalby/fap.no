'use strict'
var util = require("util")
var moment = require('moment')

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


    var addOrUpdateServer = function (data) {
        var serversDiv = document.querySelector("#servers")
        var serversUl = serversDiv.children[0].children[0]

        var isAlreadyAdded = function (hostname) {
            for (var i = 0; i < serversUl.length; i++) {
                if (serversUl[i].id === hostname) {
                    return true
                }
            }
            return false
        }

        var createServerHTML = function (data) {
            var lastUpdate = moment(data.UpdatedAt)
            var html = util.format('<div class="collapsible-header">%s<span>.%s</span></div>', data.hostname, data.domain)
            html += '<div class="collapsible-body">'
            html += '<div class="row">'
            html += util.format('<div class="col s4"><p class="attr-title">%s</p><p class="attr-value">%s</p></div>', "Last update:", lastUpdate.format('DD-MM-YYYY HH:mm:ss'))
            html += util.format('<div class="col s4"><p class="attr-title">%s</p><p class="attr-value">%s</p></div>', "Operating system:", data.os)
            html += util.format('<div class="col s4"><p class="attr-title">%s</p><p class="attr-value">%s</p></div>', "Internal IP:", data.internal)
            html += '</div>'
            html += '<div class="row">'
            html += util.format('<div class="col s4"><p class="attr-title">%s</p><p class="attr-value">%s</p></div>', "Public IP:", data.public)
            html += util.format('<div class="col s4"><p class="attr-title">%s</p><p class="attr-value">%s</p></div>', "Uptime:", data.uptime)
            html += util.format('<div class="col s4"><p class="attr-title">%s</p><p class="attr-value">%s</p></div>', "Load:", data.load)
            html += '</div>'
            html += "</div>"
            return html
        }

        if (isAlreadyAdded(data.hostname)) {
            var li = document.querySelector("#" + data.hostname)
            li.innerHTML = createServerHTML(data)
            li.setAttribute("data-last-updated", data.UpdatedAt)
        } else {
            var li = document.createElement("li")
            li.id = data.hostname
            li.setAttribute("data-last-updated", data.UpdatedAt)
            li.innerHTML = createServerHTML(data)
            serversUl.appendChild(li)
        }

        //div.children[1].style.display = "none"
        //div.children[0].addEventListener("click", function (e) {
        //    hideToggle(div.children[1])
        //})


    }

    var hideToggle = function (element) {
        if (element.style.display === "none") {
            element.style.display = "block"
        } else {
            element.style.display = "none"
        }
    }

    var sortServers = function () {
        var serversDiv = document.querySelector("#servers")
        var serversUl = serversDiv.children[0].children[0]
        var serversArray = [].slice.call(serversUl.children)

        serversUl.innerHTML = ""

        serversArray.sort(function (a, b) {
            var aDate = moment(a.getAttribute("data-last-updated"))
            var bDate = moment(b.getAttribute("data-last-updated"))
            return aDate.unix() - bDate.unix()
        }).reverse().forEach(function (element) {
            serversUl.appendChild(element)
        })

    }

    var updateCollapsible = function () {
        $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }


    return {
        init: function () {
            var socket = new WebSocket(getWSAddress())

            socket.onmessage = function (event) {
                var msg = JSON.parse(event.data)

                console.log(msg.dataType)
                switch(msg.dataType) {
                    case "init":
                        for (var i = 0; i < msg.data.length; i++) {
                            addOrUpdateServer(msg.data[i])
                        }
                        sortServers()
                        updateCollapsible()
                        break
                    case "server":
                        addOrUpdateServer(msg.data)
                        sortServers()
                        updateCollapsible()
                        break
                }

            }
        },
    }

})()

app.init()
