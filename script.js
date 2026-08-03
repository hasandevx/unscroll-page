/* ==========================================================================
   Unscroll Interactive Landing Page Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if user already joined waitlist in LocalStorage
    const savedCode = localStorage.getItem('unscroll_vip_code');
    if (savedCode) {
        showSuccessState(savedCode);
    }

    // 2. Form Submission Handler
    const form = document.getElementById('waitlistForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('userEmail');
            const email = emailInput.value.trim();

            if (!email) return;

            // Generate unique VIP claim code
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const code = `UNSCROLL-VIP-${randomId}`;

            // Save to LocalStorage
            localStorage.setItem('unscroll_vip_email', email);
            localStorage.setItem('unscroll_vip_code', code);

            // Optional external form submission (e.g. FormSubmit, Formspree, or Google Sheets API)
            const formEndpoint = form.getAttribute('action');
            if (formEndpoint && formEndpoint !== '#' && formEndpoint !== '') {
                try {
                    await fetch(formEndpoint, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ 
                            email: email, 
                            vip_code: code,
                            timestamp: new Date().toISOString() 
                        })
                    });
                } catch (err) {
                    console.warn('Waitlist endpoint submission warning (saved locally):', err);
                }
            }

            // Increment claimed count
            const claimedElem = document.getElementById('claimedCount');
            if (claimedElem) {
                let current = parseInt(claimedElem.innerText.replace(',', '')) || 847;
                claimedElem.innerText = (current + 1).toLocaleString();
            }

            showSuccessState(code);
        });
    }

    // 3. Accordion Handler
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

            // Open clicked if was not active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

function showSuccessState(code) {
    const form = document.getElementById('waitlistForm');
    const successBox = document.getElementById('waitlistSuccess');
    const codeElem = document.getElementById('vipCode');

    if (form && successBox && codeElem) {
        form.classList.add('hidden');
        codeElem.innerText = code;
        successBox.classList.remove('hidden');
    }
}

function copyVipCode() {
    const codeText = document.getElementById('vipCode').innerText;
    navigator.clipboard.writeText(codeText).then(() => {
        const icon = document.getElementById('copyIcon');
        if (icon) {
            icon.setAttribute('data-lucide', 'check');
            lucide.createIcons();
            setTimeout(() => {
                icon.setAttribute('data-lucide', 'copy');
                lucide.createIcons();
            }, 2000);
        }
    });
}

/* Modal Open/Close logic */
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside content
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};
