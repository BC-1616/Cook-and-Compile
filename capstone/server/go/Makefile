BINARY_NAME=start-server

build:
	go build -o ${BINARY_NAME} ./code/

run: build
	./${BINARY_NAME} &

clean:
	go clean
	rm ${BINARY_NAME}