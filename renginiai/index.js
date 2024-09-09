// Random SpongeBob and Simpsons GIFs
const spongebobGifs = [
    'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    'https://media.giphy.com/media/l4Jz3a8jO92crUlWM/giphy.gif',
    'https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif',
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'
];

const simpsonsGifs = [
    'https://media.giphy.com/media/xTiTnuhyBF54B852nK/giphy.gif',
    'https://media.giphy.com/media/l2JhOJpzWBJoX9s7m/giphy.gif',
    'https://media.giphy.com/media/YTzTOuVUxK8og/giphy.gif',
    'https://media.giphy.com/media/13YrHUvPzUUmkM/giphy.gif'
];

// Function to get a random GIF from an array
function getRandomGif(gifArray) {
    const randomIndex = Math.floor(Math.random() * gifArray.length);
    return gifArray[randomIndex];
}

// Set random GIFs to the left and right advertisement panels
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('spongebobGif').src = getRandomGif(spongebobGifs);
    document.getElementById('simpsonsGif').src = getRandomGif(simpsonsGifs);

    // Initialize other DOM-related functionality
    checkJWTAndInitialize();
});

// Check JWT and initialize form, subscription, or redirect if not logged in
function checkJWTAndInitialize() {
    const jwtToken = getCookie("JWT");
    if (jwtToken == null) {
        window.location.href = 'http://127.0.0.1:5500/renginiai/login.html';
    } else {
        checkSubscriptionStatus();
    }
}

// Check subscription status and handle form display
async function checkSubscriptionStatus() {
    const jwtToken = getCookie("JWT");
    try {
        const response = await fetch('http://localhost:8080/klientas/prenumerata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:jwtToken
        });

        const data = await response.text();
        if (data == 2) { 
            openForm();
        }
    } catch (error) {
        console.error('Error checking subscription:', error);
    }
}

// Admin access check
async function adminPatikra() {
    const jwtToken = getCookie("JWT");

    try {
        const response = await fetch('http://localhost:8080/klientas/adminpatikra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jwtToken
        });

        const data = await response.text();
        if (data === "admin123") {
            window.location.href = 'http://127.0.0.1:5500/renginiai/adminmenu.html';
        } else {
            alert("Prieiga negalima.");
        }
    } catch (error) {
        console.error('Admin access error:', error);
    }
}

// Cookie utility functions
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
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length);
    }
    return null;
}

// Open and close subscription form
function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
    const jwtToken = getCookie("JWT");

    fetch('http://localhost:8080/klientas/prenumeratosatsisakymas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: jwtToken })
    });
}

// Handle subscription sign-up
function uzsisakoPrenumerata() {
    const email = document.getElementById("prenumeratosEmail").value;

    const duomenys = {
        vardas: "abc",
        elPastas: email
    };

    fetch('http://localhost:8080/email/uzsisakeprenumerata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duomenys)
    })
    .then(response => response.text())
    .then(data => {
        if (data === "success") {
            document.getElementById("myForm").style.display = "none";
            alert("Prenumerata sėkmingai aktyvuota!");
        } else {
            alert("Prenumerata nesėkminga.");
        }
    })
    .catch(error => {
        console.error('Subscription error:', error);
    });
}

// ----------------------------- EVENT HANDLING ------------------------------------

// Load events on page load
document.addEventListener('DOMContentLoaded', function () {
    loadEvents(); // Load events when the page is ready
});

// Load events function
async function loadEvents() {
    try {
        const response = await fetch('http://localhost:8080/renginiai/all'); // Fetch events from backend
        if (response.ok) {
            const events = await response.json();
            displayEvents(events); // Display events
        } else {
            console.error('Failed to load events.');
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Function to display events
function displayEvents(events) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear the list before adding new items

    events.forEach(event => {
        const div = document.createElement('div');
        div.classList.add('event-card');

        // Assuming event.foto contains a Base64 encoded image
        const imageUrl = `data:image/jpeg;base64,${event.foto}`;

        div.innerHTML = `
            <h3>${event.pavadinimas}</h3>
            <p>Renginio tipas: ${event.tipas}</p>
            <p>Data: ${new Date(event.data).toLocaleString()}</p>
            <img src="${imageUrl}" alt="${event.pavadinimas}" style="max-width: 100%; height: auto;">
            <p>Price: $${event.kaina.toFixed(2)}</p>
            <button onclick="registerForEvent(${event.id})">Registruotis</button>
        `;
        eventList.appendChild(div);
    });
}

// Function to register for an event
function registerForEvent(eventId) {
    alert(`Registered for event with ID: ${eventId}`);
    
}

$(document).ready(function() {
    $('.popup-button').click(function(e) {
      $('.wrapper').fadeIn(500);
      $('.popup-box').removeClass('transform-out').addClass('transform-in');
  
      e.preventDefault();
    });
  
    $('.popup-close').click(function(e) {
      $('.wrapper').fadeOut(500);
      $('.popup-box').removeClass('transform-in').addClass('transform-out');
  
      e.preventDefault();
    });
  });
