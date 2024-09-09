// DOMContentLoaded listener for admin check
addEventListener("DOMContentLoaded", (event) => {
    adminPatikra();
});

// Check if the user is an admin
async function adminPatikra() {
    const jwtToken = getCookie("JWT");
    if (!jwtToken) {
        window.location.href = 'http://127.0.0.1:5500/renginiai/index.html';
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/klientas/adminpatikra', {
            method: 'POST',
            headers: {}, 
            body: jwtToken 
        });

        const data = await response.text();
        if (data !== "admin123") {
            window.location.href = 'http://127.0.0.1:5500/renginiai/index.html';
        }
    } catch (error) {
        window.location.href = 'http://127.0.0.1:5500/renginiai/index.html';
    }
}

// Utility to get cookies
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Load events on page load
async function loadEvents() {
    try {
        const response = await fetch('http://localhost:8080/renginiai/all');
        if (response.ok) {
            const events = await response.json();
            displayEvents(events);
        } else {
            console.error('Failed to load events.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display events
function displayEvents(events) {
    const eventList = document.getElementById('eventList').querySelector('ul');
    eventList.innerHTML = ''; // Clear the list before adding new items

    events.forEach(event => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="event-card">
                <label>
                    <input type="checkbox" class="event-checkbox" value="${event.id}">
                    <strong></strong>
                </label>
                <h3>${event.pavadinimas}</h3>
                <p>Renginio tipas: ${event.tipas}</p>
                <p>Date: ${new Date(event.data).toLocaleString()}</p>
                <img src="data:image/jpeg;base64,${event.foto}" alt="${event.pavadinimas}" style="max-width: 100%; height: auto;">
                <p>Price: $${event.kaina.toFixed(2)}</p>
                <button onclick="registerForEvent(${event.id})">Registruotis</button>
            </div>
        `;
        eventList.appendChild(li);
    });

    // Enable/Disable Edit and Delete buttons based on selection
    document.querySelectorAll('.event-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const selectedCheckbox = document.querySelector('.event-checkbox:checked');
            const editEventBtn = document.getElementById('editEventBtn');
            const deleteEventBtn = document.getElementById('deleteEventBtn');

            if (selectedCheckbox) {
                editEventBtn.disabled = false;
                deleteEventBtn.disabled = false;
            } else {
                editEventBtn.disabled = true;
                deleteEventBtn.disabled = true;
            }
        });
    });
}

// Function to register for an event (for future logic)
function registerForEvent(eventId) {
    console.log("Registering for event with ID:", eventId);
}

// Event listeners for buttons
document.addEventListener('DOMContentLoaded', function () {
    const newEventBtn = document.getElementById('newEventBtn');
    const editEventBtn = document.getElementById('editEventBtn');
    const deleteEventBtn = document.getElementById('deleteEventBtn');
    const eventForm = document.getElementById('eventForm');
    const eventFormContent = document.getElementById('eventFormContent');
    const formActionBtn = document.getElementById('formActionBtn');
    
    let selectedEventId = null;

    // Load events when the page loads
    loadEvents();

    // New Event button click
    newEventBtn.addEventListener('click', function () {
        selectedEventId = null; // Clear selected event ID
        eventFormContent.reset(); // Clear the form
        formActionBtn.textContent = 'Save Event'; // Set button text to "Save Event"
        formActionBtn.onclick = saveNewEvent; // Set function to save new event
        eventForm.style.display = 'block'; // Show the form
    });

    // Edit Event button click
    editEventBtn.addEventListener('click', function () {
        const selectedCheckbox = document.querySelector('.event-checkbox:checked');
        if (selectedCheckbox) {
            selectedEventId = selectedCheckbox.value; // Get the selected event ID
            loadEventData(selectedEventId); // Load the event data into the form
        } else {
            alert('Please select an event to edit.');
        }
    });

    // Save Event function for creating a new event
    async function saveNewEvent(event) {
        event.preventDefault();
        const formData = new FormData(eventFormContent);

        try {
            const response = await fetch('http://localhost:8080/renginiai/create', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Event saved successfully!');
                eventFormContent.reset(); // Clear the form
                eventForm.style.display = 'none'; // Hide the form
                loadEvents(); // Reload the events list
            } else {
                alert('Failed to save event. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }

    // Update Event function for editing an existing event
    async function updateEvent(event) {
        event.preventDefault();
        const formData = new FormData(eventFormContent);
        formData.append('eventId', selectedEventId); // Append the event ID for updating

        try {
            const response = await fetch(`http://localhost:8080/renginiai/update/${selectedEventId}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                alert('Event updated successfully!');
                eventFormContent.reset(); // Clear the form
                eventForm.style.display = 'none'; // Hide the form
                loadEvents(); // Reload the events list
            } else {
                alert('Failed to update event. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }

    // Load event data into the form for editing
    async function loadEventData(eventId) {
        const response = await fetch(`http://localhost:8080/renginiai/event/${eventId}`);
        if (response.ok) {
            const event = await response.json();
            document.getElementById('eventName').value = event.pavadinimas;
            document.getElementById('eventType').value = event.tipas;
            document.getElementById('eventDate').value = new Date(event.data).toISOString().slice(0, 16);
            document.getElementById('eventPrice').value = event.kaina;
            formActionBtn.textContent = 'Edit Event'; // Change button text to "Edit Event"
            formActionBtn.onclick = updateEvent; // Set function to update the event
            eventForm.style.display = 'block'; // Show the form
        } else {
            alert('Failed to load event data. Please try again.');
        }
    }

    // Delete the selected event
    deleteEventBtn.addEventListener('click', function () {
        const selectedCheckbox = document.querySelector('.event-checkbox:checked');
        if (selectedCheckbox) {
            const confirmDelete = confirm('Are you sure you want to delete this event?');
            if (confirmDelete) {
                deleteEvent(selectedCheckbox.value); // Delete the selected event
            }
        } else {
            alert('Please select an event to delete.');
        }
    });

    // Delete the selected event
    async function deleteEvent(eventId) {
        try {
            const response = await fetch(`http://localhost:8080/renginiai/delete/${eventId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Event deleted successfully!');
                loadEvents(); // Reload the events list
            } else {
                alert('Failed to delete event. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadEvents() {
        try {
            const response = await fetch('http://localhost:8080/renginiai/all');
            if (response.ok) {
                const events = await response.json();
                displayEvents(events);
            } else {
                console.error('Failed to load events.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
