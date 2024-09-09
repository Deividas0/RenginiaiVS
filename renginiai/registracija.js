function submitForm(event) {
    event.preventDefault();

    const x = document.getElementById("registerError");

    const form = document.getElementById('regForma');
    const formData = new FormData(form);

    const registracija = {
        vardas: form.vardas.value,
        pavarde: form.pavarde.value,
        elPastas: form.elPastas.value,
        telNumeris: form.telNumeris.value,
        slaptazodis: form.slaptazodis.value
    };

    formData.append('Klientas', JSON.stringify(registracija));

    fetch('http://localhost:8080/klientas/emailpatikra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elPastas: registracija.elPastas })
    })
    .then(response => response.text())
    .then(data => {
        if (data === "yra") {
            x.innerText = "Toks el. pašto adresas jau naudojamas."
        } else {
            fetch('http://localhost:8080/klientas/registracija', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registracija)
            })
            .then(response => response.text())
            .then(data => {
                if (data === "success") {
                    return fetch('http://localhost:8080/email/prisiregistravo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ vardas: registracija.vardas, elPastas: registracija.elPastas })
                    });
                } else {
                    throw new Error('Registration failed');
                }
            })
            .then(response => response.text())
            .then(data => {
                if (data === "success") {
                    alert("Registracija sėkminga.")
                    window.location.href = "http://127.0.0.1:5500/renginiai/index.html";
                } else {
                    alert('el-pasto klaida');
                }
                console.log(data);
            })
            .catch(error => {
                alert('Įvyko klaida: ' + error.message);
                console.error(error);
            });
        }})}
