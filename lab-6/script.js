import Ajax from '/Ajax-lib/ajax.js';
const ajaxClient = new Ajax();

const dataList=document.getElementById('data-list');
const errorDisplay=document.getElementById('error-message');
const loader=document.getElementById('loader');

function displayData(data){
    dataList.innerHTML='';
    if(!Array.isArray(data)){
        data = [data];
    }

    data.forEach(item => {
        const li = document.createElement('li');
        const content = item.title || item.name || (item.body ? item.body.substring(0, 50) + '...' : `ID: ${item.id}`);
        li.textContent = `[ID: ${item.id}] ${content}`;
        dataList.appendChild(li);
    });


}
function setLoading(isLoading){
    loader.style.display=isLoading ? 'block' : 'none';
    dataList.style.display=isLoading ? '0.5' : '1';
}

document.getElementById('fetch-data-btn').addEventListener('click', async () => {
    resetView();
    setLoading(true);
    try{
        const posts = await ajaxClient.get('/posts?_limit=10');
        displayData(posts);
    }catch(error){
        displayError(error.message);
    } finally {
        setLoading(false);

    }});

document.getElementById('fetch-error-btn').addEventListener('click', async () => {
    resetView();
    setLoading(true);
     try{
        await ajaxClient.get('/posts/999999');
     }catch(error){
        displayError(error.message);
     }finally {
        setLoading(false);
     }});

document.getElementById('reset-btn').addEventListener('click', resetView);
function displayError(message) {
    errorDisplay.textContent = `Błąd: ${message}`;
    errorDisplay.style.display = 'block';
}
function resetView(){
    dataList.innerHTML='';
    errorDisplay.textContent='';
    errorDisplay.style.display='none';
    setLoading(false);
}
document.addEventListener('DOMContentLoaded', resetView);