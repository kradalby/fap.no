PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

build.css: 
	lessc less/style.less static/css/bundle.css
	autoprefixer static/css/bundle.css

build.js:
	browserify js/app.js -o static/js/bundle.js

build: build.js build.css

watch.css: 
	nodemon -I -w less/ --ext less --exec 'make build.css' &

watch.js:
	watchify js/app.js -o static/js/bundle.js -v &

watch: watch.css watch.js

jshint:
	jshint --reporter node_modules/jshint-stylish/stylish.js js/; true

dev:
	npm install

run: watch
	python3 -m http.server &
#
#test: 
#	go test

all: dev initjs build
