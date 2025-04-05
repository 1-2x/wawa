// You can add JavaScript for dynamic features if needed, like form submission or animations.
// Here's a simple example for form validation:

document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (name && email && message) {
        alert("Message sent successfully!");
        // You can add AJAX to actually send this data to a server if you need.
    } else {
        alert("Please fill out all fields.");
    }
});
