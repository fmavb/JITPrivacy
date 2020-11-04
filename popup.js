

window.onload = () => {
    chrome.storage.sync.get("form", (data) => {
        console.log(data);
        const id = document.getElementById("id1");
        id.innerHTML = "<ul>";
        
        for (let i = 0; i < data.form.forms.length; i++){
            id.innerHTML += "<li>" + data.form.forms[i] + "</li>";
        }
        id.innerHTML += "</ul>";
    });
}