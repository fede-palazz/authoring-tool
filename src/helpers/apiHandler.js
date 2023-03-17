const API_URL = 'http://localhost:8001/engine-rest';

async function deployDiagram(diagram, diagramId, diagramName) {
  console.log('Deployment...');
  const url = API_URL + '/deployment/create';
  const blob = new Blob([diagram], { type: 'text/xml' });

  const form = new FormData();
  form.append('deployment-name', diagramName);
  form.append('deployment-source', 'Authoring Tool');
  form.append('enable-duplicate-filtering', 'true'); // don't deploy already existing deployment
  form.append(diagramName, blob, diagramName);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: form,
    });
    const json = await response.json();
    console.log('Deployment finished');
    return json;
  } catch (error) {
    throw new Error(error);
  }
}

export { deployDiagram };
