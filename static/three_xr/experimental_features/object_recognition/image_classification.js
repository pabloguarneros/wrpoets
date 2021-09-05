let net;
const webcamElement = document.getElementById('webcam');


async function app() {

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  const webcam = await tf.data.webcam(webcamElement);

  $("#fetch_wiki").on('click',fetch_wiki);

  while (true) {

    const img = await webcam.capture();
    result = await net.classify(img);
    document.getElementById('console').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;
  
    img.dispose();
    await tf.nextFrame();
  }

}

app();

function post_wiki(text){
  $("#post_wiki").html(text)
}

async function fetch_wiki() {
  const searchQuery = result[0].className.split(',')[0];
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&format=json&origin=*&exlimit=1&titles=${searchQuery}&explaintext=1&formatversion=2`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  post_wiki(json["query"]["pages"][0]["extract"]);
}
