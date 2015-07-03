

var app = (function () {

    var socketAddress = "ws://localhost:7777/api/v1/ws"

    


    return {
        init: function () {
            var socket = new WebSocket(socketAddress)

            socket.onmessage = function (event) {
                var msg  = JSON.parse(event.data)
                console.log(msg)

                //switch(msg.type) {
                //    case "servers":
                //        console.log(msg)
                //        break
                //}

            }
        },
    }

})()

app.init()
