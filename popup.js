

window.onload = () => {
    chrome.storage.sync.get("form", (data) => {
        console.log(data);
        const id = document.getElementById("id1");
        id.innerHTML = "<ul>\n";
        
        for (let i = 0; i < data.form.forms.length; i++){
            for (key in data.form.forms[i]){
                if (key != "formID")
                    if (key == "password" || key == "pass")
                        id.innerHTML += "<li>" + key + ": <input type=password disabled=true value=" + data.form.forms[i][key] + ">" + "</input></li>\n";
                    else {
                        id.innerHTML += "<li>" + key + ": <input disabled=true value=" + data.form.forms[i][key] + ">" + "</input></li>\n";
                    }
            }
        }
        id.innerHTML += "</ul>\n";
        document.getElementById("submitButton").style.display = "inline";
    });
}

document.getElementById("submitButton").addEventListener("click", (e) =>{
    chrome.storage.sync.get("form", (data)=>{
        let formID;
        for (let i = 0; i < data.form.forms.length; i++){
            for (key in data.form.forms[i]){
                console.log(data.form.forms[i]);
                if (key === "formID")
                    formID = data.form.forms[i]["formID"];
                    console.log(formID);
                    break;
            }
        }
        chrome.storage.sync.set({confirm: "Send", "formID": formID});
    });
});