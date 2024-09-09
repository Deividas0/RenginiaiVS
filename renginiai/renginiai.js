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
            displayEvents(events); // Call the function to display events
        } else {
            console.error('Failed to load events.');
        }
    } catch (error) {
        console.error('Error:', error);
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
        const imageUrl = `data:image/jpeg;base64,${event.foto}`; // Use Base64 temporarily for display

        div.innerHTML = `
            <h3>${event.pavadinimas}</h3>
            <p>Renginio tipas: ${event.tipas}</p>
            <p>Data: ${new Date(event.data).toLocaleString()}</p>
            <img src="${imageUrl}" alt="${event.pavadinimas}" style="max-width: 100%; height: auto;">
            <p>Price: $${event.kaina.toFixed(2)}</p>
            <button onclick="uploadAndRegisterForEvent(${event.id}, '${event.pavadinimas}', ${event.kaina}, '${event.foto}')">Registruotis</button>
        `;
        eventList.appendChild(div);
    });
}

// Function to upload the image to Imgur and get the public URL
async function uploadImageToImgur(imageBase64) {
    const clientId = '0a36a44a35dd72d'; // Replace with your Imgur Client ID
    const formData = new FormData();
    formData.append('image', imageBase64);

    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${clientId}`
            },
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            return result.data.link;  // Public URL of the uploaded image
        } else {
            console.error('Imgur upload failed:', result);
            return null;
        }
    } catch (error) {
        console.error('Error uploading image to Imgur:', error);
        return null;
    }
}

// Function to handle image upload and register for the event with Stripe
async function uploadAndRegisterForEvent(eventId, eventName, eventPrice, imageBase64) {
    // First, upload the image to Imgur to get the public URL
    const imageUrl = await uploadImageToImgur(imageBase64);
    if (!imageUrl) {
        alert('Failed to upload image. Please try again.');
        return;
    }

    // Now, send the data to the backend to create a Stripe Checkout session
    const data = {
        eventName: eventName,
        eventPrice: eventPrice * 100,  // Stripe expects price in cents
        imageUrl: imageUrl  // Pass the public image URL to Stripe
    };

    try {
        const response = await fetch('http://localhost:8080/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const { checkoutUrl } = await response.json();
            window.location.href = checkoutUrl; // Redirect to Stripe Checkout
        } else {
            console.error('Failed to create Stripe Checkout session.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
