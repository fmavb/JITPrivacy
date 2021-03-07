sensitivityToClass = {
    1 : "low",
    2 : "medium",
    3 : "high"
};

window.onload = () => {
    chrome.storage.sync.get("form", (data) => {
        console.log(data);
        const id = document.getElementById("id1");
        if (data.form.keywords){
            for (let i = 0; i < data.form.keywords.length; i++){
                let html = "<div class='bars ";
                const field = data.form.keywords[i];
                html += sensitivityToClass[field.prediction] + "'>";
                html += field.word;
                html += "</div>\n";
                id.innerHTML += html;
            }
        }
        document.getElementById("noChange").style.display = "none";
    });
}

/*document.getElementById("submitButton").addEventListener("click", (e) =>{
    chrome.storage.sync.get("form", (data)=>{
        console.log(data);
        chrome.storage.sync.set({confirm: "Send", "formID": data.form.formID});
    });
});*/

chrome.storage.onChanged.addListener((changes, areaName) =>{
    if (areaName === "sync" && changes.form){
        chrome.storage.sync.get("form", (data) => {
            console.log(data);
            const id = document.getElementById("id1");
            console.log(data.form.keywords);
            for (let i = 0; i < data.form.keywords.length; i++){
                let html = "<div class='bars ";
                const field = data.form.keywords[i];
                html += sensitivityToClass[field.prediction] + "'>";
                html += field.word;
                html += "</div>\n";
                id.innerHTML += html;
            }
            document.getElementById("noChange").style.display = "none";
        });
    }
    else if (areaName === "sync" && changes.cleared){
        document.getElementById("noChange").style.display = "inline";
        document.getElementById("id1").innerHTML = "";
        chrome.storage.sync.set({cleared: false});
    }
});