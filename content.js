
const privacyFields = {
    "fields": [
        "password",
        "pass",
        "email",
        "address",
        "SSN",
        "NISS",
        "username",
        "login"
    ]
};

const port = chrome.runtime.connect({name: "form"});
    
const forms = document.getElementsByTagName("form");
const fieldsInForm = [];
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
}

if (fieldsInForm.length !== 0)
    port.postMessage({forms:fieldsInForm});

