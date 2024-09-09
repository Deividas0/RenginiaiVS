function submitForm(event) {
    event.preventDefault();

    const x = document.getElementById("neteisingiDuomenys");
    
    const form = document.getElementById('loginForma');
    const formData = new FormData(form);

    const prisijungimas = {
        elPastas: form.elPastas.value,
        slaptazodis: form.slaptazodis.value
    };

    formData.append('Klientas', JSON.stringify(prisijungimas));

    fetch('http://localhost:8080/klientas/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prisijungimas)
    })

    .then(response => response.text())
    .then(data => {
        if (data.length > 25) {
            setCookie("JWT", data, 7)
            window.location.href = "http://127.0.0.1:5500/renginiai/index.html";
            alert("Sėkmingai prisijungta!")
             }
             else {
                x.innerText = "Neteisingi duomenys";
             }
    })
    .catch(error => {
        x.innerText = "Neteisingi duomenys";
        console.error(error);
    });
    
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
async function prenumeratosPatikra(){
    const jwtToken = getCookie("JWT");
    fetch('http://localhost:8080/klientas/prenumerata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jwtToken
    })
    .then(response => response.text())
    .then(data => {
        if (data == 2) {    // PAPILDYTI SU PASIRINKIMAIS { 0 = Prenumeratos nenori, 1 = nori, 2 = dar nepaklausta }
            alert(data)
             }
    })
    .catch(error => {
        x.innerText = "Neteisingi duomenys";
        console.error(error);
    });
}