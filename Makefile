PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/zsh

build.css: 
	lessc less/style.less static/css/bundle.css
	autoprefixer static/css/bundle.css

build.js:
#	browserify frontend/js/app.js -o public/javascripts/bundle.js
	cp js/* static/js/

build.go:
	go build

build: build.js build.css

watch.css: 
	nodemon -I -w frontend/less/ --ext less --exec 'npm 	run build:css'

watch.js:
	watchify frontend/js/app.js -o public/javascriptsripts/bundle.js -v

watch: watch.css watch.js

jshint:
	jshint --reporter node_modules/jshint-stylish/stylish.js frontend/js/; true

dev:
	go get
	npm install

run: 
	go run main.go

test: 
	go test

all: initjs build run
