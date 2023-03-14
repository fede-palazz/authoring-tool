const API_URL = 'http://localhost:8001/engine-rest';

function deployDiagram(diagram, diagId, diagName) {
  return new Promise((resolve, reject) => {
    const url = API_URL + '/deployment/create';

    let bodyContent = new FormData();
    bodyContent.append('deployment-name', 'test-deployment');
    bodyContent.append('deployment-source', 'test-source');
    bodyContent.append(
      'data',
      '/home/fede/Projects/IDEA/TEAMING.AI/repo/user-stories/teaming-engine/developer/example/basicStarter/basic1.bpmn'
    );

    fetch(url, { method: 'POST', body: bodyContent })
      .then((response) => {
        console.log('Finished fetch');
        response.json();
      })
      .then((result) => {
        console.log('Parsed JSON');
        resolve(result);
      })
      .catch((error) => console.log(error));
  });
}

export { deployDiagram };
