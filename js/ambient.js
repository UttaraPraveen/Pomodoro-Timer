(function() {
    
  const ambientSelect = document.getElementById('ambient-select');
  const ambientToggle = document.getElementById('ambient-toggle');
  
  // Single Audio object to prevent memory leaks and ensure only one sound plays
  let currentAudio = null;
  let isPlaying = false;

  // Sound mapping based on files in assets/sounds/
  const soundManifest = {
    'rain': 'assets/sounds/rain.mp3',
    'Soft_Instrumental': 'assets/sounds/Soft_Instrumental.mp3',
    'Sea_waves': 'assets/sounds/Sea_waves.mp3',
    'white_noise': 'assets/sounds/white_noise.mp3'
  };

  /**
   * Updates the toggle button UI based on play state.
   */
  function updateToggleUI() {
    // Using simple icons, but keeping it premium with subtle scale if needed
    ambientToggle.textContent = isPlaying ? '⏸' : '▶';
    ambientToggle.style.borderColor = isPlaying ? 'var(--accent)' : 'var(--border)';
    ambientToggle.style.color = isPlaying ? 'var(--text)' : 'var(--muted)';
  }

  /**
   * Loads and plays the selected sound.
   */
  function playCurrentSelection() {
    const soundKey = ambientSelect.value;
    
    // If "None" is selected, stop everything
    if (soundKey === 'none') {
      stopAmbient();
      return;
    }

    const audioPath = soundManifest[soundKey];
    if (!audioPath) return;

    // Initialize or Update Audio Object
    if (!currentAudio) {
      currentAudio = new Audio(audioPath);
      currentAudio.loop = true;
    } else if (!currentAudio.src.includes(audioPath)) {
      // If switching sounds, pause current and change source
      currentAudio.pause();
      currentAudio.src = audioPath;
    }

    // Play the audio
    currentAudio.play()
      .then(() => {
        isPlaying = true;
        updateToggleUI();
      })
      .catch(err => {
        console.warn("Ambient Audio play failed (likely user interaction required):", err);
        isPlaying = false;
        updateToggleUI();
      });
  }

  /**
   * Pauses the current ambient sound.
   */
  function stopAmbient() {
    if (currentAudio) {
      currentAudio.pause();
    }
    isPlaying = false;
    updateToggleUI();
  }

  /**
   * Multi-track toggle logic.
   */
  function handleToggleClick() {
    if (isPlaying) {
      stopAmbient();
    } else {
      if (ambientSelect.value === 'none') {
        // If user clicks play but selection is None, default to first available
        ambientSelect.value = 'rain';
      }
      playCurrentSelection();
    }
  }

  // Event Listeners
  ambientSelect.addEventListener('change', () => {
    // If a sound is already playing, switch it immediately on selection change
    if (isPlaying || ambientSelect.value !== 'none') {
      playCurrentSelection();
    }
  });

  ambientToggle.addEventListener('click', (e) => {
    e.preventDefault();
    handleToggleClick();
  });
})();
