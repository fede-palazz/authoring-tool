# Authoring Tool

This repository contains source code and files used during the development of the Authoring Tool prototype to accomplish task 5.2 of the Teaming.AI project.

## Getting started

### Prerequisites

- Node.js v16 (tested with `v16.15`)

### Installation

```bash
# Clone this repository
$ git clone https://github.com/IlPalazz/authoring-tool.git

# Install the dependencies
$ npm install

# Launch the authoring tool
$ npm start
```

### Examples

You can find some diagrams examples under the `src/assets/diagrams` directory and import them into the editor.

## Features

- possibility to create and modify BPMN diagrams
- import local diagrams functionality
- export diagrams functionality (`.bpmn`, `.svg`)
- token simulation mode

## External libraries

- [bpmn-js](https://github.com/bpmn-io/bpmn-js)

- [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation)
- [webpack](https://webpack.js.org/)
