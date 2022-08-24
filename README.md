# Authoring Tool

This repository contains source code and files used during the development of the Authoring Tool prototype to accomplish task 5.2 of the Teaming.AI project.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (tested with `v16.15`)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker compose](https://docs.docker.com/compose/install/compose-plugin/#installing-compose-on-linux-systems)

### Installation

```bash
# Clone this repository
$ git clone https://github.com/IlPalazz/authoring-tool.git

# Install dependencies
$ npm install

# Launch the Authoring tool
$ npm start
```

### Docker

```bash
# Generate static assets inside the dist folder
$ npm run build

# Docker will copy them inside the container and
# they will be served by NGINX

# Build the image and start the container
# (use --build flag to update image with local changes)
$ docker-compose up -d --build

# Stop running container
$ docker-compose down
```

## Examples

You can find some diagrams examples under the `src/assets/diagrams` directory and import them into the editor.

## Features

- create and modify BPMN diagrams
- import local diagrams
- homepage displaying recently opened diagrams
- save and delete diagrams from browser's local storage
- export diagrams in .bpmn and .svg formats
- token simulation mode

## External libraries

- [bpmn-js](https://github.com/bpmn-io/bpmn-js)

- [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation)
- [webpack](https://webpack.js.org/)
