import $ from 'jquery';

async function handleResearchPaperInput(text){
    const endpoint = `/taiko/convert?text=${text}`;
    const return_value  = await fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            return data
        })
    return return_value

} 
export {handleResearchPaperInput}