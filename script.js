document.addEventListener('DOMContentLoaded', () => {
    // 1. Floating Hearts Background
    const heartsContainer = document.getElementById('floatingHearts');
    const heartSymbols = ['❤️', '💖', '💕', '🥰', '🌹' ,'💋'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        // Random positioning and sizing
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        heart.style.animationDuration = (Math.random() * 5 + 10) + 's'; // 10-15s float duration
        
        heartsContainer.appendChild(heart);
        
        // Remove after animation ends to prevent memory leaks
        setTimeout(() => {
            heart.remove();
        }, 15000);
    }

    // Create a new heart every 500ms
    setInterval(createHeart, 500);


    // 2. Playful "No" Button
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    
    // Desktop: Hover to move
    noBtn.addEventListener('mouseover', moveButton);
    
    // Mobile: Touch to move (touchstart is better than click for this specific interaction)
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click
        moveButton();
    });

    function moveButton() {
        const container = document.querySelector('.question-box');
        const containerRect = container.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        // Calculate max allowed positions relative to the container
        const maxX = containerRect.width - btnRect.width;
        const maxY = containerRect.height - btnRect.height;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        // Apply new position using absolute positioning context of the buttons container's parent
        // or easier: translate transform
        // Actually, since it's just a funny interaction, let's use fixed or absolute.
        // Let's use simple style overrides if parent is relative, or transforms.
        
        // To make it run ANYWHERE on the screen (more chaotic/fun):
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const newX = Math.random() * (windowWidth - btnRect.width - 40) + 20; // adding some padding
        const newY = Math.random() * (windowHeight - btnRect.height - 40) + 20;

        noBtn.style.position = 'fixed'; // Break out of flow
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
    }


    // 3. "Yes" Button & Modal Logic
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal');

    yesBtn.addEventListener('click', () => {
        triggerConfetti();
        modal.style.display = 'flex';
        
        // Enhance: Play music if you want to add an audio element later
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        // Cleanup weird fixed button if they clicked no before
        noBtn.style.position = 'static'; 
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 4. Confetti Effect (using canvas-confetti library)
    function triggerConfetti() {
        // Simple confetti burst
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#ff8fa3', '#ffffff']
        });

        // Continuous heart rain for a few seconds
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                shapes: ['heart'],
                colors: ['#ff4d6d', '#ffccd5']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                shapes: ['heart'],
                colors: ['#ff4d6d', '#ffccd5']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // 5. Time Together Animation
    const startDate = new Date('2025-04-13T00:00:00');
    const hoursElem = document.getElementById('hours-count');
    const minutesElem = document.getElementById('minutes-count');
    const secondsElem = document.getElementById('seconds-count');

    function getTimeData() {
        const now = new Date();
        const diff = now - startDate;
        
        // Total Seconds
        const totalSeconds = Math.floor(diff / 1000);
        
        // Calculate Hours (Total hours)
        const hours = Math.floor(totalSeconds / 3600);
        
        // Calculate remaining Minutes
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        // Calculate remaining Seconds
        const remainingSeconds = totalSeconds % 60; 

        return { hours, minutes, remainingSeconds };
    }

    // Animation variables
    let animationStartTime = null;
    const animationDuration = 10000; // 10 seconds

    function animateCounter(timestamp) {
        if (!animationStartTime) animationStartTime = timestamp;
        const progress = timestamp - animationStartTime;
        
        const { hours: targetHours, minutes: targetMinutes, remainingSeconds: targetSeconds } = getTimeData();

        if (progress < animationDuration) {
            // Easing function (easeOutExpo)
            const ease = 1 - Math.pow(2, -10 * progress / animationDuration);
            
            const currentHours = Math.floor(targetHours * ease);
            const currentMinutes = Math.floor(targetMinutes * ease);
            const currentSeconds = Math.floor(targetSeconds * ease);

            hoursElem.innerText = currentHours.toLocaleString();
            minutesElem.innerText = currentMinutes;
            secondsElem.innerText = currentSeconds;
            
            requestAnimationFrame(animateCounter);
        } else {
            // Animation done, switch to realtime interval
            startRealtimeUpdates();
        }
    }

    function startRealtimeUpdates() {
        setInterval(() => {
            const { hours, minutes, remainingSeconds } = getTimeData();
            hoursElem.innerText = hours.toLocaleString();
            minutesElem.innerText = minutes;
            secondsElem.innerText = remainingSeconds;
        }, 1000);
    }

    // Start animation when section is in view
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(animateCounter);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const timeSection = document.getElementById('time-together');
    if (timeSection) {
        observer.observe(timeSection);
    } else {
        // Fallback
        requestAnimationFrame(animateCounter);
    }

    // 6. Gallery Flip Logic
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('flipped');
        });
    });

    // 7. Special Envelope Logic
    const envelope = document.getElementById('specialEnvelope');
    const envelopeCard = envelope.querySelector('.card-content');
    let isEnvelopeOpen = false;

    envelope.addEventListener('click', (e) => {
        // Prevent closing or weird behavior if already open, 
        // unless creating a "close" mechanic, but "reveal" usually implies one-way.
        if (!isEnvelopeOpen) {
            isEnvelopeOpen = true;
            envelope.classList.add('open');
            triggerConfetti(); // Celebration!
            
            // Remove the instruction text after opening
            const instruction = document.querySelector('.click-instruction');
            if (instruction) instruction.style.opacity = '0';
        }
    });

    // Allow flipping the card inside the envelope ONLY after it's revealed
    // We attach the listener to the card content itself
    envelopeCard.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling to envelope (though envelope click does nothing if open)
        if (isEnvelopeOpen) {
            envelopeCard.classList.toggle('flipped');
        }
    });
});

