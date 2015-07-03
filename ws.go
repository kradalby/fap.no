package main


import (
	"github.com/olahol/melody"
)

var mee melody.Melody = nil

func getMelodyInstance() *melody.Melody {
	if m == nil {
		m = melody.New()
	}
	return m
}