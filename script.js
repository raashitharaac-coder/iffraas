// Birthday Surprise Website - Main Script
// Enhanced for security, performance, and cross-platform compatibility

(function() {
  'use strict';

  // HTTPS Security Check
  if (location.protocol !== 'https:' && !location.hostname.includes('localhost') && !location.hostname.includes('127.0.0.1')) {
    console.warn('Note: This website is best served over HTTPS for optimal security.');
  }

  // DOM Elements
  const securityForm = document.getElementById('securityForm');
  const securityMessage = document.getElementById('securityMessage');
  const securityOverlay = document.getElementById('securityOverlay');
  const introOverlay = document.getElementById('introOverlay');
  const mainContent = document.getElementById('mainContent');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const musicToggle = document.getElementById('musicToggle');
  const videoElements = document.querySelectorAll('.memory-video');
  const confettiContainer = document.getElementById('confettiContainer');

  const correctAnswers = {
    firstMeeting: '02/04/2023',
    lastMeeting: '06/06/2026',
  };

  // Configuration
  const config = {
    confettiPieces: 90,
    confettiDuration: 3000,
    animationDelay: 0.12,
    transitionDelay: 700,
  };

  function startIntroSequence() {
    // Show an intro card for exactly 5 seconds, then reveal the security screen.
    if (!securityOverlay || !introOverlay || !mainContent) return;

    // Ensure main content is hidden and not focusable
    mainContent.classList.add('hidden');
    mainContent.setAttribute('aria-hidden', 'true');

    // Hide the security overlay while intro is visible
    try {
      securityOverlay.classList.add('hidden');
      securityOverlay.style.display = 'none';
      securityOverlay.setAttribute('aria-hidden', 'true');
    } catch (e) {}

    // Show intro overlay (fully opaque, covers screen)
    introOverlay.classList.remove('hidden');
    introOverlay.classList.remove('fade-out');
    introOverlay.style.display = 'flex';
    introOverlay.setAttribute('aria-hidden', 'false');

    // Lock scrolling while intro is active
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Light confetti during intro for subtle effect
    try { triggerLightConfetti(); } catch (e) { /* ignore */ }

    // After 5 seconds, fade intro out and show security overlay
    setTimeout(() => {
      try {
        introOverlay.style.transition = 'opacity 0.8s ease, visibility 0.8s ease';
        introOverlay.style.opacity = '0';
        introOverlay.setAttribute('aria-hidden', 'true');
      } catch (e) {}

      setTimeout(() => {
        try {
          introOverlay.classList.add('hidden');
          introOverlay.style.opacity = '';
          introOverlay.style.display = 'none';
        } catch (e) {}

        // Show security overlay and keep scroll locked
        try {
          securityOverlay.style.display = 'flex';
          securityOverlay.classList.remove('hidden');
          securityOverlay.setAttribute('aria-hidden', 'false');
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
        } catch (e) {}
      }, 820);
    }, 5000);
  }

  // Light confetti used during intro (smaller, faster)
  function triggerLightConfetti() {
    if (!confettiContainer) return;
    const colors = ['#ff6b9b', '#ffd66b', '#8be3ff'];
    const viewportWidth = window.innerWidth;
    const pieceCount = /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 12 : 24;
    const duration = 1200;

    for (let i = 0; i < pieceCount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti-piece');
      const size = Math.floor(Math.random() * 8) + 6;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size * 0.4}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * viewportWidth}px`;
      confetti.style.top = `-${size}px`;
      confetti.style.animationDuration = `${1 + Math.random() * 1}s`;
      confetti.style.opacity = `${0.7 + Math.random() * 0.3}`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confettiContainer.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) confetti.remove();
      }, duration);
    }
  }

  // Utility Functions
  function showMessage(text, isError = false) {
    if (!securityMessage) return;
    securityMessage.textContent = text;
    securityMessage.style.color = isError ? '#ff8a8a' : '#b8ffb6';
  }

  function playBackgroundMusic() {
    if (!backgroundMusic) return null;

    // Ensure music is explicitly set to loop for continuous playback.
    backgroundMusic.loop = true;

    if (backgroundMusic.paused) {
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (musicToggle) musicToggle.textContent = 'Pause Music';
        }).catch(() => {
          console.log('Autoplay blocked; user interaction required.');
        });
      }
      return playPromise;
    }

    if (musicToggle) {
      musicToggle.textContent = 'Pause Music';
    }
    return null;
  }

  function triggerConfetti() {
    if (!confettiContainer) return;

    const colors = ['#ff6b9b', '#ffd66b', '#8be3ff', '#d39bff', '#ff9de2'];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust confetti pieces based on device capability
    const pieceCount = /mobile|android|iphone|ipad/i.test(navigator.userAgent) 
      ? Math.floor(config.confettiPieces * 0.6) 
      : config.confettiPieces;

    for (let i = 0; i < pieceCount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti-piece');
      const size = Math.floor(Math.random() * 10) + 6;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size * 0.4}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * viewportWidth}px`;
      confetti.style.top = `-${size}px`;
      confetti.style.animationDuration = `${2 + Math.random() * 1.6}s`;
      confetti.style.opacity = `${0.7 + Math.random() * 0.3}`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confettiContainer.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.remove();
        }
      }, config.confettiDuration);
    }
  }

  function openSurprise() {
    try {
      // Clear sensitive inputs
      const firstInput = document.getElementById('firstMeeting');
      const lastInput = document.getElementById('lastMeeting');
      if (firstInput) firstInput.value = '';
      if (lastInput) lastInput.value = '';
      if (securityMessage) securityMessage.textContent = '';

      // Show main content
      if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.setAttribute('tabindex', '-1');
        mainContent.setAttribute('aria-hidden', 'false');
        try { mainContent.focus(); } catch (e) {
          console.warn('Could not focus main content:', e);
        }
      }

      // Hide and remove overlay
      if (securityOverlay) {
        // Fade overlay out smoothly and then remove it
        securityOverlay.setAttribute('aria-hidden', 'true');
        if (securityForm) {
          securityForm.removeEventListener('submit', handleSecuritySubmit);
        }
        try {
          securityOverlay.style.transition = 'opacity 0.8s ease';
          securityOverlay.style.opacity = '0';
        } catch (e) {
          /* ignore */
        }
        // Restore scrolling
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        setTimeout(() => {
          if (securityOverlay.parentNode) {
            securityOverlay.parentNode.removeChild(securityOverlay);
          }
        }, 820);
      }

      // Start music and celebration
      if (backgroundMusic) {
        playBackgroundMusic();
      }

      triggerConfetti();
    } catch (error) {
      console.error('Error opening surprise:', error);
    }
  }

  function handleSecuritySubmit(event) {
    event.preventDefault();
    try {
      const fmEl = document.getElementById('firstMeeting');
      const lmEl = document.getElementById('lastMeeting');
      const firstMeetingInput = fmEl ? fmEl.value.trim() : '';
      const lastMeetingInput = lmEl ? lmEl.value.trim() : '';

      if (
        firstMeetingInput.toLowerCase() === correctAnswers.firstMeeting.toLowerCase() &&
        lastMeetingInput.toLowerCase() === correctAnswers.lastMeeting.toLowerCase()
      ) {
        showMessage('Welcome! Your surprise is ready. 🎉');
        // Start background music using the user interaction from unlocking.
        try { playBackgroundMusic(); } catch (e) { console.warn('Background music play error', e); }
        // Play confetti immediately to celebrate success, then reveal
        try { triggerConfetti(); } catch (e) { console.warn('Confetti error', e); }
        // Remove ability to resubmit
        if (securityForm) securityForm.querySelectorAll('input,button').forEach(el=>el.setAttribute('disabled','true'));
        // Wait for confetti animation then reveal content
        setTimeout(() => {
          openSurprise();
        }, Math.max(config.confettiDuration, config.transitionDelay));
      } else {
        showMessage('Wrong Answer! 😜 Try Again.', true);
        // Shake animation on error
        if (securityForm) {
          securityForm.style.animation = 'shake 0.4s ease-in-out';
          setTimeout(() => {
            securityForm.style.animation = '';
          }, 400);
        }
      }
    } catch (error) {
      console.error('Error handling security submit:', error);
      showMessage('An error occurred. Please try again.', true);
    }
  }

  window.addEventListener('load', () => {
    // Initialize security-first flow on page load
    try {
      startIntroSequence();
    } catch (e) {
      console.error('Error initializing security flow:', e);
    }
  });

  // Event Listeners - Security Form
  if (securityForm) {
    securityForm.addEventListener('submit', handleSecuritySubmit);
  }

  // Music Toggle
  if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener('click', () => {
      try {
        if (backgroundMusic.paused) {
          const playPromise = backgroundMusic.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              musicToggle.textContent = 'Pause Music';
            }).catch(() => {
              console.log('Autoplay blocked.');
            });
          }
        } else {
          backgroundMusic.pause();
          musicToggle.textContent = 'Play Music';
        }
      } catch (error) {
        console.error('Error toggling music:', error);
      }
    });
  }

  // Photo memory captions
  const memoryInputs = document.querySelectorAll('.memory-caption-input input');

  memoryInputs.forEach((input) => {
    const card = input.closest('.gallery-card');
    let preview = card?.querySelector('.memory-caption-preview');

    if (!preview && card) {
      preview = document.createElement('p');
      preview.className = 'memory-caption-preview';
      card.appendChild(preview);
    }

    const updatePreview = () => {
      if (!preview) return;
      const value = input.value.trim();
      preview.textContent = value;
      preview.classList.toggle('has-text', Boolean(value));
    };

    input.addEventListener('input', updatePreview);
    updatePreview();
  });

  // Video and Music Interaction
  function pauseMusicForVideo(video) {
    if (backgroundMusic && !backgroundMusic.paused) {
      backgroundMusic.pause();
      if (musicToggle) musicToggle.textContent = 'Play Music';
      video.dataset.musicPaused = 'true';
    }
  }

  function isAnyVideoPlaying() {
    return Array.from(videoElements).some((video) => !video.paused && !video.ended && video.currentTime > 0);
  }

  function resumeMusicAfterVideo(video) {
    if (video.dataset.musicPaused === 'true' && backgroundMusic && backgroundMusic.paused && !isAnyVideoPlaying()) {
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      if (musicToggle) musicToggle.textContent = 'Pause Music';
      video.dataset.musicPaused = 'false';
    }
  }

  videoElements.forEach((video) => {
    video.addEventListener('play', () => pauseMusicForVideo(video));
    video.addEventListener('pause', () => resumeMusicAfterVideo(video));
    video.addEventListener('ended', () => resumeMusicAfterVideo(video));
    video.addEventListener('seeking', () => {
      if (!video.paused) {
        pauseMusicForVideo(video);
      }
    });
  });

  // Fade-up Animation Delay
  window.addEventListener('load', () => {
    try {
      const fadeElements = document.querySelectorAll('.fade-up');
      fadeElements.forEach((el, index) => {
        el.style.animationDelay = `${index * config.animationDelay}s`;
      });

      // Log performance metrics if available
      if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
      }
    } catch (error) {
      console.error('Error setting up fade animations:', error);
    }
  });

  // Preload audio for better performance
  if (backgroundMusic) {
    backgroundMusic.loop = true;
    backgroundMusic.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and ready to play.');
    });
    backgroundMusic.addEventListener('ended', () => {
      try {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(() => {
          // Autoplay restrictions may prevent immediate replay until next interaction.
        });
      } catch (e) {
        console.warn('Background music restart error', e);
      }
    });
  }

  // Performance: Lazy load videos
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.tagName === 'VIDEO') {
          entry.target.preload = 'auto';
        }
      });
    });

    videoElements.forEach((video) => {
      videoObserver.observe(video);
    });
  }

  // Service Worker Registration (Optional PWA support)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        // Service worker registration failed, site will still work
        console.log('Service Worker registration optional.');
      });
    });
  }

})();

// Add shake animation for error feedback
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

