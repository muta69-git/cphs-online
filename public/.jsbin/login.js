const login_button = document.getElementById("login-button");
const signup_button = document.getElementById("signup-button");
const email_input = document.getElementById("gmail-input");
const username_input = document.getElementById("username-input");
const password_input = document.getElementById("password-input");

login_button.onclick = async e => {
        if (!email_input.value.endsWith("@students.cps.k12.in.us")) return;
        if (password_input.value == "" || password_input.value == " ") return;
        if (email_input.value == "" || email_input.value == " ") return;

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email_input.value, password: password_input.value})
    };

    email_input.value = "";
    password_input.value = "";
        
    let res = await fetch("/account/login", options);
    res = await res.json();
        
    if (res.accepted) {
        window.location = "../index.html";
    }
};

signup_button.onclick = async e =>  {
    if (username_input == "" || username_input == " ") return;

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email_input.value, username: username_input.value, password: password_input.value})
    };

    email_input.value = "";
    username_input.value = "";
    password_input.value = "";

    let res = await fetch("/account/signup", options);
    res = await res.json();

    if (!res.accepted) {
        if (res.reason == "Email address already in use.") {
            // - > conditional to check if there is a system box already, if not create one and display error

            setTimeout(() => {
                email_input.placeholder = "username@students.cps.k12.in.us";
            }, 2000);
        } else if (res.reason == "Invalid email address.") {
            // - > conditional to check if there is a system box already, if not create one and display error

            setTimeout(() => {
                email_input.placeholder = "username@students.cps.k12.in.us";
            }, 2000);
        }
    } else {
        window.location = "./portal-su_user_suc.html";
    }   
};