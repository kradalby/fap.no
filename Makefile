SHELL := /bin/bash

build:
	go build

dev:
	go get

run: 
	go run *.go

test: 
	go test

clean:
	rm -rf ~/go/pkg

all: run
