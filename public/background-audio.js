document.addEventListener("DOMContentLoaded", function() {
    // Ensure we don't add it twice
    if (document.getElementById('site-bg-audio')) return;

    const audio = document.createElement('audio');
    audio.id = 'site-bg-audio';
    audio.src = './songs/fletchpike-daytime-farm-ambience-409990.mp3';
    audio.loop = true;
    audio.volume = 0.4; // Pleasant background volume
    // Hide it from view
    audio.style.display = 'none';
    document.body.appendChild(audio);

    // Resume from where we left off on the previous page for seamless feeling
    const savedTime = sessionStorage.getItem('bgAudioTime');
    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    // Function to try playing
    const tryPlay = () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Autoplay blocked - wait for user interaction
                console.log("Autoplay blocked, waiting for interaction.");
            });
        }
    };

    // Attempt to play immediately
    tryPlay();

    // Any interaction should trigger play if it was blocked
    const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart'];
    const startAudioInteraction = () => {
        audio.play().then(() => {
            // Once successfully playing, remove these listeners
            interactionEvents.forEach(evt => document.removeEventListener(evt, startAudioInteraction));
        }).catch(e => {});
    };

    interactionEvents.forEach(evt => document.addEventListener(evt, startAudioInteraction, { passive: true }));

    // Save playback position before navigating away
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('bgAudioTime', audio.currentTime);
    });
});
