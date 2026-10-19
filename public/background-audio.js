(function() {
    const STORAGE_KEY = 'site_sound_enabled';
    const AUDIO_TIME_KEY = 'bgAudioTime';
    const AUDIO_SRC = '/songs/fletchpike-daytime-farm-ambience-409990.mp3';

    let audio = null;

    // Helper for safe localStorage access
    function getStoredSoundPreference() {
        try {
            const val = localStorage.getItem(STORAGE_KEY);
            // Default to OFF for new visitors unless explicitly 'true'
            return val === 'true';
        } catch (e) {
            console.warn('Storage access failed, defaulting sound to OFF:', e);
            return false;
        }
    }

    function setStoredSoundPreference(enabled) {
        try {
            localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
        } catch (e) {
            console.warn('Storage save failed:', e);
        }
    }

    let soundEnabled = getStoredSoundPreference();

    // Interaction handler to overcome browser autoplay blocks when sound is ON
    function onUserInteraction() {
        if (!soundEnabled || !audio) return;
        audio.play().then(() => {
            removeInteractionListeners();
        }).catch(() => {});
    }

    const interactionEvents = ['click', 'keydown', 'touchstart'];
    function addInteractionListeners() {
        interactionEvents.forEach(evt => document.addEventListener(evt, onUserInteraction, { passive: true }));
    }
    function removeInteractionListeners() {
        interactionEvents.forEach(evt => document.removeEventListener(evt, onUserInteraction));
    }

    function updateToggleButton(btn, enabled) {
        if (!btn) return;
        btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        btn.setAttribute('aria-label', enabled ? 'Geluid dempen' : 'Geluid inschakelen');
        btn.setAttribute('title', enabled ? 'Geluid uitschakelen (huidige status: Aan)' : 'Geluid inschakelen (huidige status: Uit)');
        
        // Update icon
        const icon = btn.querySelector('.sound-icon');
        if (icon) {
            icon.textContent = enabled ? 'volume_up' : 'volume_off';
        }

        // Update optional text label
        const label = btn.querySelector('.sound-label');
        if (label) {
            label.textContent = enabled ? 'Aan' : 'Uit';
        }

        // Update styling
        if (enabled) {
            btn.classList.add('sound-active', 'text-primary', 'border-primary', 'bg-primary/10');
            btn.classList.remove('text-on-surface', 'border-outline-variant/40', 'bg-surface-container-low');
        } else {
            btn.classList.remove('sound-active', 'text-primary', 'border-primary', 'bg-primary/10');
            btn.classList.add('text-on-surface', 'border-outline-variant/40', 'bg-surface-container-low');
        }
    }

    function updateAllToggleButtons(enabled) {
        const buttons = document.querySelectorAll('.sound-toggle-btn');
        buttons.forEach(btn => updateToggleButton(btn, enabled));
    }

    function initAudio() {
        if (audio) return audio;
        audio = document.getElementById('site-bg-audio');
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'site-bg-audio';
            audio.src = AUDIO_SRC;
            audio.loop = true;
            audio.volume = 0.4;
            audio.style.display = 'none';
            document.body.appendChild(audio);
        }

        // Restore playback position if available
        try {
            const savedTime = sessionStorage.getItem(AUDIO_TIME_KEY);
            if (savedTime) {
                audio.currentTime = parseFloat(savedTime);
            }
        } catch (e) {}

        return audio;
    }

    function enableSound() {
        soundEnabled = true;
        setStoredSoundPreference(true);
        initAudio();
        audio.muted = false;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                removeInteractionListeners();
            }).catch(() => {
                // Autoplay blocked by browser policy; wait for first interaction
                addInteractionListeners();
            });
        }

        updateAllToggleButtons(true);
        window.dispatchEvent(new CustomEvent('soundstatechange', { detail: { enabled: true } }));
    }

    function disableSound() {
        soundEnabled = false;
        setStoredSoundPreference(false);
        removeInteractionListeners();
        
        if (audio) {
            try {
                sessionStorage.setItem(AUDIO_TIME_KEY, audio.currentTime);
            } catch (e) {}
            audio.pause();
            audio.muted = true;
        }

        updateAllToggleButtons(false);
        window.dispatchEvent(new CustomEvent('soundstatechange', { detail: { enabled: false } }));
    }

    function toggleSound() {
        if (soundEnabled) {
            disableSound();
        } else {
            enableSound();
        }
    }

    // Public SoundManager API
    window.SoundManager = {
        isSoundEnabled: function() { return soundEnabled; },
        enable: enableSound,
        disable: disableSound,
        toggle: toggleSound,
        playSoundEffect: function(src, volume) {
            if (!soundEnabled) return;
            try {
                const sfx = new Audio(src);
                sfx.volume = (volume !== undefined ? volume : 0.5);
                sfx.play().catch(() => {});
            } catch (e) {}
        }
    };

    function setupDOM() {
        initAudio();

        // Fallback injection if toggle buttons are not statically present in nav
        if (!document.querySelector('.sound-toggle-btn')) {
            const desktopNav = document.querySelector('nav .hidden.lg\\:flex');
            if (desktopNav) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'sound-toggle-btn flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container hover:border-primary/50 text-on-surface hover:text-primary transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40';
                btn.innerHTML = '<span class="material-symbols-outlined sound-icon text-[20px]">volume_off</span>';
                desktopNav.appendChild(btn);
            }
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            if (mobileMenuBtn && mobileMenuBtn.parentNode) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'sound-toggle-btn flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 mr-2';
                btn.innerHTML = '<span class="material-symbols-outlined sound-icon text-[20px]">volume_off</span>';
                mobileMenuBtn.parentNode.insertBefore(btn, mobileMenuBtn);
            }
        }

        // Attach click listeners to all buttons matching .sound-toggle-btn
        const buttons = document.querySelectorAll('.sound-toggle-btn');
        buttons.forEach(btn => {
            if (btn.dataset.soundBound) return;
            btn.dataset.soundBound = 'true';
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleSound();
            });
        });

        // Initialize UI state
        updateAllToggleButtons(soundEnabled);

        // If sound was previously saved as ON, try starting playback
        if (soundEnabled) {
            enableSound();
        } else {
            // Default is OFF: ensure audio stays paused and muted
            if (audio) {
                audio.pause();
                audio.muted = true;
            }
        }

        // Save position on unload
        window.addEventListener('beforeunload', () => {
            if (audio) {
                try {
                    sessionStorage.setItem(AUDIO_TIME_KEY, audio.currentTime);
                } catch (e) {}
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupDOM);
    } else {
        setupDOM();
    }
})();
