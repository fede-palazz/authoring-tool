# Authoring Tool

This repository contains source code and files used during the development of the Authoring Tool prototype to accomplish task 5.2 of the Teaming.AI project.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (tested with `v18.13.0`)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker compose](https://docs.docker.com/compose/install/compose-plugin/#installing-compose-on-linux-systems)

### Installation

```bash
# Install dependencies
$ npm install

# Launch the Authoring Tool
$ npm start
```

### Docker

```bash
# Start auth-tool container (use --build flag to update image with local changes)
$ docker-compose up -d

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
- support camunda properties panel

## External libraries

- [bpmn-js](https://github.com/bpmn-io/bpmn-js)
- [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation)
- [bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel)
- [webpack](https://webpack.js.org/)
