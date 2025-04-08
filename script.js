document.addEventListener('DOMContentLoaded', () => {
    const tempEmailInput = document.getElementById('temp-email');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const emailListDiv = document.getElementById('email-list');

    // --- IMPORTANT ---
    // This backendUrl needs to point to your *actual* backend service
    // that handles email generation and retrieval.
    // This is NOT something GitHub Pages can provide.
    const backendUrl = 'YOUR_SEPARATE_BACKEND_API_ENDPOINT';
    // Example: const backendUrl = 'https://api.your-email-service.com';

    let currentEmail = '';

    async function generateNewAddress() {
        // **Placeholder:** In a real setup, you'd call your backend API
        // try {
        //   const response = await fetch(`${backendUrl}/generate`);
        //   const data = await response.json();
        //   currentEmail = data.emailAddress;
        //   tempEmailInput.value = currentEmail;
        //   fetchEmails(); // Fetch emails for the new address
        // } catch (error) {
        //   console.error("Error generating address:", error);
        //   tempEmailInput.value = "Error generating address";
        // }

        // **Static Example (No Backend):**
        currentEmail = `temp${Math.random().toString(36).substring(2, 8)}@wawa.rip`;
        tempEmailInput.value = currentEmail;
        emailListDiv.innerHTML = '<p>Generated new address. Waiting for emails...</p>';
        alert("This is a frontend demo. It cannot actually receive emails without a backend service.");
    }

    async function fetchEmails() {
        if (!currentEmail) {
            emailListDiv.innerHTML = '<p>Generate an address first.</p>';
            return;
        }

        // **Placeholder:** In a real setup, you'd call your backend API
        // try {
        //   const response = await fetch(`${backendUrl}/emails?address=${encodeURIComponent(currentEmail)}`);
        //   const emails = await response.json();
        //   displayEmails(emails);
        // } catch (error) {
        //   console.error("Error fetching emails:", error);
        //   emailListDiv.innerHTML = '<p>Error fetching emails. Is the backend running?</p>';
        // }

        // **Static Example (No Backend):**
         emailListDiv.innerHTML = `<p>Inbox for ${currentEmail} would appear here. (Requires backend)</p>`;
         // Add demo email structure if needed for testing layout
         // displayEmails([{ from: 'sender@example.com', subject: 'Test Email', body: 'This is the body.', timestamp: Date.now() }]);
    }

    function displayEmails(emails) {
        if (!emails || emails.length === 0) {
            emailListDiv.innerHTML = `<p>No emails received for ${currentEmail}.</p>`;
            return;
        }

        emailListDiv.innerHTML = ''; // Clear previous list
        emails.forEach(email => {
            const emailDiv = document.createElement('div');
            emailDiv.classList.add('email-item');
            emailDiv.innerHTML = `
                <div><span class="email-sender">From:</span> ${email.from}</div>
                <div><span class="email-subject">Subject:</span> ${email.subject}</div>
                <div class="email-body">${email.body}</div>
                <div><small>${new Date(email.timestamp).toLocaleString()}</small></div>
            `;
            emailListDiv.appendChild(emailDiv);
        });
    }

    function copyToClipboard() {
        if (!tempEmailInput.value) return;
        navigator.clipboard.writeText(tempEmailInput.value).then(() => {
            alert('Email address copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy address.');
        });
    }

    generateBtn.addEventListener('click', generateNewAddress);
    copyBtn.addEventListener('click', copyToClipboard);
    refreshBtn.addEventListener('click', fetchEmails);

    // Generate an initial address on load
    generateNewAddress();
});
