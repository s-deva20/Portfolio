// Custom Cursor
const cursor = document.querySelector('.cursor-dot');
const magneticElements = document.querySelectorAll('.magnetic');
const cards = document.querySelectorAll('.tilt-card');

// Update cursor position
window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Magnetic Buttons Effect
magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
        cursor.classList.add('cursor-hover');
        
        // Element's position relative to viewport
        const rect = elem.getBoundingClientRect();
        
        // Center of the element
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Distance from cursor to center
        const distanceX = e.clientX - x;
        const distanceY = e.clientY - y;
        
        // Apply transform (move slightly towards cursor)
        elem.style.transform = `translate(${distanceX * 0.2}px, ${distanceY * 0.2}px)`;
    });
    
    elem.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        elem.style.transform = ''; // Reset
    });
});

// Click effect on cursor
window.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
});

window.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Intersection Observer for Scroll Animations
const revealElements = document.querySelectorAll('.reveal');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: unobserve if you only want it to load once
            // scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => scrollObserver.observe(el));

// Counter animation for Coding Profiles
const counterElements = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const targetEl = entry.target;
            const targetVal = parseInt(targetEl.getAttribute('data-target'), 10);
            const suffix = targetEl.getAttribute('data-suffix') || '';
            const duration = 1800; // 1.8 seconds animation duration
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease-out quad curve for organic deceleration
                const easeOutQuad = progress * (2 - progress);
                const currentCount = Math.floor(easeOutQuad * targetVal);
                
                targetEl.innerText = currentCount + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    targetEl.innerText = targetVal + suffix;
                }
            };
            
            requestAnimationFrame(animate);
            observer.unobserve(targetEl); // Trigger only once
        }
    });
}, {
    threshold: 0.2
});
counterElements.forEach(el => counterObserver.observe(el));


// 3D Tilt Effect for Project Cards
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on cursor position
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Smooth Scroll for Navbar Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
            
            // Update active state manually (Optional, intersection observer below is better)
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Update Navbar Active State based on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
});

// Contact Form Submission (Web3Forms)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let res = await response.json();
            if (response.status == 200) {
                formStatus.textContent = "Message sent successfully!";
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                console.log(response);
                formStatus.textContent = res.message || "Something went wrong. Please try again.";
                formStatus.className = 'form-status error';
            }
        })
        .catch(error => {
            console.log(error);
            formStatus.textContent = "Error sending message. Please check your connection.";
            formStatus.className = 'form-status error';
        })
        .then(function() {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            setTimeout(() => {
                formStatus.textContent = "";
                formStatus.className = 'form-status';
            }, 5000);
        });
    });
}

// Certificate Lightbox Logic
const lightbox = document.getElementById('cert-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const certCards = document.querySelectorAll('.cert-card');

if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    certCards.forEach(card => {
        const viewBtn = card.querySelector('.cert-view-btn');
        const imgContainer = card.querySelector('.cert-thumbnail');
        
        const openModal = () => {
            const certSrc = viewBtn.getAttribute('data-cert');
            const certTitle = viewBtn.getAttribute('data-title');
            
            lightboxImg.src = certSrc;
            lightboxCaption.textContent = certTitle;
            
            lightbox.style.display = 'flex';
            // Trigger reflow to apply opacity transition
            lightbox.offsetHeight;
            lightbox.classList.add('active');
        };

        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }
        
        if (imgContainer) {
            imgContainer.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }
    });

    // Close lightbox when clicking the X button
    lightboxClose.addEventListener('click', () => {
        closeLightbox();
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-container')) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
    }, 300); // matches the CSS transition time
}


