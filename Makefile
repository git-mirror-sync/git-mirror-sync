include .env
export $(shell sed 's/=.*//' .env)

pack:
	webpack -d
lint:
	csslint css/style.css
web:
	node web.js
