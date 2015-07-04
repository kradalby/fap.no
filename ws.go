package main


import (
	"encoding/json"
	"log"
	"github.com/olahol/melody"
)

type Envelope struct {
	DataType   string		`json:"dataType"`
	Data       interface{}		`json:"data"`

}

func prepareAndDistributeWSData(dataType string, data interface{}) {

	message := Envelope{
		DataType: dataType,
		Data: data,
	}
	j, err := json.Marshal(message)

	if err != nil {
		log.Printf("Error while encoding struct")
	}

	m.Broadcast(j)
}

func sendAllServersOnConnect(s *melody.Session) {
	servers := g.getAllServers()


	message := Envelope{
		DataType: "init",
		Data: servers,
	}

	s.Write(superMarshaller(message))

}

func superMarshaller(message interface{}) []byte {
	j, err := json.Marshal(message)

	if err != nil {
		log.Printf("Error while encoding struct")
	}

	//pack := "'" + string(j) + "'"
	pack := string(j)

	return []byte(pack)
}