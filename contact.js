// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                type: formData.get('type'),
                timestamp: new Date().toISOString()
            };
            
            // Store in localStorage (in a real app, this would be sent to a server)
            const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
            feedbacks.push(data);
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
            
            // Show success message
            showMessage('Thank you for your feedback! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
});

function showMessage(text, type = 'info') {
    // Remove existing messages
    const existing = document.querySelector('.message');
    if (existing) existing.remove();
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    // Insert after form
    const form = document.getElementById('contact-form');
    if (form) {
        form.parentNode.insertBefore(message, form.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}
