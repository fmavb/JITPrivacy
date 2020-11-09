
const privacyFields = {
    "fields": [
        "password",
        "pass",
        "email",
        "address",
        "SSN",
        "NIN",
        "username",
        "login"
    ]
};

const port = chrome.runtime.connect({name: "form"});
    
const forms = document.getElementsByTagName("form");
const fieldsInForm = [];

for (let i = 0; i < forms.length; i++){
    forms[i].addEventListener("submit", (e) => {
        console.log("Event triggered");
        e.preventDefault();
        const inputs = forms[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++){
            for (let k = 0; k < privacyFields.fields.length; k++){
                const objectToPush = {}
                const pattern = new RegExp(privacyFields.fields[k]);
                if (pattern.test(inputs[j].name) || pattern.test(inputs[j].id)){
                    objectToPush[privacyFields.fields[k]] = inputs[j].value;
                    fieldsInForm.push(objectToPush);
                }
            }
        }
        if (fieldsInForm.length !== 0)
            console.log(fieldsInForm);
            fieldsInForm.push({formID: i});
            port.postMessage({forms:fieldsInForm});
            fieldsInForm.splice(0, fieldsInForm.length);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    console.log(request);
});

/*
for (let i = 0; i < forms.length; i++){
    const inputs = forms[i].getElementsByTagName("input");
    for (let j = 0; j < inputs.length; j++){
        for (let k = 0; k < privacyFields.fields.length; k++){
            const pattern = new RegExp(privacyFields.fields[k]);
            if (pattern.test(inputs[j].name) || pattern.test(inputs[j].id)){
                fieldsInForm.push(privacyFields.fields[k]);
            }
        }
  }
}*/

/*if (fieldsInForm.length !== 0)
    port.postMessage({forms:fieldsInForm});*/

