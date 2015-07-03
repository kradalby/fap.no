package dashboard

import (
    "io"
    "log"
    "net"

    "golang.org/x/net/websocket"
)

const channelBufSize = 100

var maxId int = 0

// Chat client.
type Client struct {
    id     int
    ws     *websocket.Conn
    server *Server
    ch     chan *Message
    doneCh chan bool
}

// Create new chat client.
func NewClient(ws *websocket.Conn, server *Server) *Client {

    if ws == nil {
        log.Fatal("ws cannot be nil")
    }

    if server == nil {
        log.Fatal("server cannot be nil")
    }

    maxId++
    ch := make(chan *Message, channelBufSize)
    doneCh := make(chan bool)

    return &Client{maxId, ws, server, ch, doneCh}
}

func (c *Client) Conn() *websocket.Conn {
    return c.ws
}

func (c *Client) Write(msg *Message) {
    select {
    case c.ch <- msg:
    }
}

func (c *Client) Done() {
    c.doneCh <- true
}

// Listen Write and Read request via chanel
func (c *Client) Listen() {
    go c.listenWrite()
    c.listenRead()
}

// Listen write request via chanel
func (c *Client) listenWrite() {
    log.Println("Listening write to client")
    for {
        select {

        // send message to the client
        case msg := <-c.ch:
            log.Println("Send:", msg)
            err := websocket.JSON.Send(c.ws, msg)
            if err.(T) == net.OpError {
                log.Printf("%T\n", err)
                log.Println("Got error, socket probably closed")
                c.Done()
            }

        }
    }
}

// Listen read request via chanel
func (c *Client) listenRead() {
    log.Println("Listening read from client")
    for {
        select {

        // receive done request
        case <-c.doneCh:
            c.server.Del(c)
            c.doneCh <- true // for listenWrite method
            return

        // read data from websocket connection
        default:
            var msg Message
            err := websocket.JSON.Receive(c.ws, &msg)
            if err == io.EOF {
                c.doneCh <- true
            } else if err != nil {
                c.server.Err(err)
            } else {
                c.server.SendAll(&msg)
            }
        }
    }
}
