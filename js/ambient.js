(function() {
    
  const ambientSelect = document.getElementById('ambient-select');
  const ambientToggle = document.getElementById('ambient-toggle');
  const ambientVolume = document.getElementById('ambient-volume');
  const effectToggle = document.getElementById('effect-toggle');

  window.ambientEffect = ambientSelect ? ambientSelect.value : 'none';
  window.ambientVisualsEnabled = true;
  
  // Single Audio object to prevent memory leaks and ensure only one sound plays
  let currentAudio = null;
  let isPlaying = false;

  // Sound mapping based on files in assets/sounds/
  const soundManifest = {
    'rain': 'assets/sounds/rain.mp3',
    'Soft_Instrumental': 'assets/sounds/Soft_Instrumental.mp3',
    'Sea_waves': 'assets/sounds/Sea_waves.mp3',
    'white_noise': 'assets/sounds/white_noise.mp3',
    'fireplace': 'assets/sounds/fireplace.mp3',
    'nature': 'assets/sounds/nature.mp3'
  };

  function updateToggleUI() {
    // Using simple icons, but keeping it premium with subtle scale if needed
    ambientToggle.textContent = isPlaying ? '⏸' : '▶';
    window.ambientIsPlaying = isPlaying; // Let visual particles read this
    if (isPlaying) {
      ambientToggle.classList.add('active');
    } else {
      ambientToggle.classList.remove('active');
    }
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
      if (ambientVolume) currentAudio.volume = ambientVolume.value;
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
    window.ambientEffect = ambientSelect.value;
    // If a sound is already playing, switch it immediately on selection change
    if (isPlaying || ambientSelect.value !== 'none') {
      playCurrentSelection();
    }
  });

  ambientToggle.addEventListener('click', (e) => {
    e.preventDefault();
    handleToggleClick();
  });

  if (ambientVolume) {
    ambientVolume.addEventListener('input', (e) => {
      if (currentAudio) currentAudio.volume = e.target.value;
    });
  }

  if (effectToggle) {
    effectToggle.addEventListener('click', (e) => {
      e.preventDefault();
      window.ambientVisualsEnabled = !window.ambientVisualsEnabled;
      effectToggle.style.opacity = window.ambientVisualsEnabled ? '1' : '0.4';
      if (window.ambientVisualsEnabled) {
        effectToggle.classList.add('active');
      } else {
        effectToggle.classList.remove('active');
      }
    });
  }
})();
