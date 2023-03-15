const API_URL = 'http://localhost:8001/engine-rest';

async function deployDiagram(diagram, diagId, diagName) {
  console.log('Deployment...');
  const url = API_URL + '/deployment/create';

  let data = new FormData();
  data.append('deployment-name', diagName);
  data.append('deployment-source', diagId);
  data.append('data', diagram);
  try {
    const response = await fetch(url, { method: 'POST', body: data });
    const responseJson = await response.json();
    console.log('Deployment finished!');
    return responseJson;
  } catch (error) {
    throw new Error(error);
  }
}

export { deployDiagram };
