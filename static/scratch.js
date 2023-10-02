document.addEventListener("DOMContentLoaded", () => {
    const contactList = document.getElementById("contact-list");
    const addContactForm = document.getElementById("add-contact-form");
    const errorMessage = document.getElementById("error-message");

    // Function to fetch and display contacts
    async function fetchContacts() {
        try {
            const response = await fetch("/contacts/");
            if (!response.ok) {
                throw new Error("Failed to fetch contacts");
            }

            const data = await response.json();

            // Clear the existing list
            contactList.innerHTML = "";

            // Display each contact
            data.forEach((contact) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${contact.name} - ${contact.email}`;
                contactList.appendChild(listItem);
            });

            errorMessage.textContent = ""; // Clear any previous error messages
        } catch (error) {
            console.error("Error fetching contacts:", error);
            errorMessage.textContent = "Failed to fetch contacts. Please try again later.";
        }
    }

    // Function to add a new contact
    async function addContact() {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        const newContact = {
            name,
            email,
        };

        try {
            const response = await fetch("/contacts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newContact),
            });

            if (!response.ok) {
                throw new Error("Failed to add contact");
            }

            // Refresh the contact list
            fetchContacts();

            // Clear the form
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            errorMessage.textContent = ""; // Clear any previous error messages
        } catch (error) {
            console.error("Error adding contact:", error);
            errorMessage.textContent = "Failed to add contact. Please try again.";
        }
    }

    // Attach event listener to the "Add Contact" button
    const addContactButton = document.getElementById("add-contact-button");
    addContactButton.addEventListener("click", () => {
        addContactForm.style.display = "block"; // Show the add contact form
    });

    // Attach event listener to the form's submit button
    addContactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addContact();
    });

    // Initial fetch of contacts
    fetchContacts();
});
