let cookie = document.cookie;

(async () => {
    if (cookie == null || cookie == undefined || cookie == "") {
        window.location = "../portal.html";
    } else {
        let options = {
            method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({usercookie: cookie})
        };

        let res = await fetch("/login", options);
        res = await res.json();
    }
})();