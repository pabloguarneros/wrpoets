import { createThreeNode } from './threeNode.js';
import { createTextNode } from './textNode.js';

function createObjects(data){
    const textNodes = new Map();
    const threeNodes = []

    data.forEach( (item) =>{        
        const pk = item.pk;
        const threeNode = createThreeNode({pk: item.pk, position: item.position});
        const textNode = createTextNode({title:item.title, text:item.text, position:item.position});
        textNodes.set(pk,textNode);
        threeNodes.push(threeNode);
    })

    return [textNodes, threeNodes]

}

export {createObjects} 