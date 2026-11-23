/* ===================================================
   ANANYA'S GRADUATION CELEBRATION — SCRIPT
   Sequence:
   1. Black screen: "Hello, Graduate." (~2s)
   2. Personal Video (centered, original aspect ratio, plays naturally until ended)
   3. Main Website + Background Music (ambient slideshow, personal letter, music toggle)
   =================================================== */

(function () {
  'use strict';

  // ============================================================
  // CONFIGURATION
  // ============================================================
  const STAGE_1_DURATION = 2000; // 2 seconds for "Hello, Graduate." screen

  // Dedicated photo memories for Ananya (ambient background)
  const IMAGE_FILES = [
    'images/ananya-1.jpeg',
    'images/ananya-2.jpeg',
    'images/ananya-3.jpeg',
    'images/ananya-4.jpeg',
    'images/ananya-5.jpeg',
    'images/ananya-6.jpeg',
    'images/ananya-7.jpeg',
    'images/ananya-8.jpeg',
    'images/ananya-9.jpeg',
    'images/ananya-10.jpeg',
    'images/ananya-11.jpeg',
    'images/ananya-12.jpeg',
    'images/ananya-13.jpeg',
    'images/ananya-14.jpeg',
    'images/ananya-15.jpeg',
  ];

  // Seconds per image in ambient loop
  const SLIDESHOW_SPEED_SECONDS_PER_IMAGE = 8;

  // Background audio volume levels
  const MUSIC_VOLUME_LOW = 0.12;    // Low volume during video playback
  const MUSIC_VOLUME_NORMAL = 0.45; // Normal sound after video finishes

  let isVideoPlaying = false;
  let videoTransitioned = false;

  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const startScreen = document.getElementById('startScreen');
  const startBtn = document.getElementById('startBtn');
  const introStage = document.getElementById('introStage');
  const videoStage = document.getElementById('videoStage');
  const personalVideo = document.getElementById('personalVideo');
  const videoSoundBtn = document.getElementById('videoSoundBtn');
  const mainStage = document.getElementById('mainStage');
  const slideshowTrack = document.getElementById('slideshowTrack');
  const noteCard = document.getElementById('noteCard');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const bgMusic = document.getElementById('bgMusic');
  const musicController = document.getElementById('musicController');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const iconPlay = document.querySelector('.icon-play');
  const iconPause = document.querySelector('.icon-pause');
  const musicText = document.getElementById('musicText');

  // ============================================================
  // STAGE 0 → STAGE 1: ASK USER TO PLAY SONG & START WEBSITE
  // ============================================================
  let stageStarted = false;

  function startExperience() {
    if (stageStarted) return;
    stageStarted = true;

    // Immediately play the song via user gesture
    startBackgroundMusic(MUSIC_VOLUME_LOW);

    // Fade out start screen to reveal Stage 1 ("Hello, Graduate.")
    if (startScreen) {
      startScreen.classList.add('fade-out');
      setTimeout(() => {
        startScreen.style.display = 'none';
      }, 800);
    }

    // Advance to Stage 2 (Video) after STAGE_1_DURATION (2 seconds)
    setTimeout(proceedToVideoStage, STAGE_1_DURATION);
  }

  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startExperience();
    });
  }

  if (startScreen) {
    startScreen.addEventListener('click', startExperience);
  }

  // ============================================================
  // STAGE 1 → STAGE 2: INTRO TO PERSONAL VIDEO
  // ============================================================
  let stage1Dismissed = false;

  function proceedToVideoStage() {
    if (stage1Dismissed) return;
    stage1Dismissed = true;

    // Fade out Stage 1
    introStage.classList.add('fade-out');

    setTimeout(() => {
      introStage.style.display = 'none';

      // Activate Stage 2 (Video)
      videoStage.classList.add('active');
      startVideoPlayback();
    }, 800);
  }

  // Allow clicking on Stage 1 to advance immediately if desired
  introStage.addEventListener('click', () => {
    proceedToVideoStage();
  });

  // ============================================================
  // VOLUME FADER HELPER
  // Smoothly transitions audio volume over durationMs
  // ============================================================
  function fadeVolume(audio, targetVolume, durationMs = 1000) {
    if (!audio) return;
    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    if (Math.abs(diff) < 0.01) {
      audio.volume = targetVolume;
      return;
    }
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      audio.volume = Math.max(0, Math.min(1, startVolume + diff * progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        audio.volume = targetVolume;
      }
    }
    requestAnimationFrame(step);
  }

  // ============================================================
  // STAGE 2: PERSONAL VIDEO PLAYBACK & AUTOPLAY HANDLING
  // ============================================================
  function startVideoPlayback() {
    isVideoPlaying = true;

    // Keep music playing at low volume while video is active
    if (bgMusic) {
      if (isMusicPlaying) {
        fadeVolume(bgMusic, MUSIC_VOLUME_LOW, 800);
      } else {
        startBackgroundMusic(MUSIC_VOLUME_LOW);
      }
    }

    if (!personalVideo) {
      transitionToMain();
      return;
    }

    // Attempt unmuted playback first
    const playPromise = personalVideo.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playing successfully
        })
        .catch(() => {
          // Autoplay with sound restricted by browser: fallback to muted playback
          personalVideo.muted = true;
          personalVideo.play().catch(() => {});

          // Display subtle unmute toggle pill
          if (videoSoundBtn) {
            videoSoundBtn.style.display = 'flex';
          }
        });
    }

    // Video ended event listener: smoothly transition to Stage 3
    personalVideo.addEventListener('ended', onVideoEnded);
  }

  // Sound toggle button for video (if muted autoplay was needed)
  if (videoSoundBtn && personalVideo) {
    videoSoundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      personalVideo.muted = !personalVideo.muted;

      const soundMutedIcon = videoSoundBtn.querySelector('.sound-icon-muted');
      const soundActiveIcon = videoSoundBtn.querySelector('.sound-icon-active');
      const soundLabel = videoSoundBtn.querySelector('.video-sound-label');

      if (personalVideo.muted) {
        if (soundMutedIcon) soundMutedIcon.style.display = 'block';
        if (soundActiveIcon) soundActiveIcon.style.display = 'none';
        if (soundLabel) soundLabel.textContent = 'Unmute';
      } else {
        if (soundMutedIcon) soundMutedIcon.style.display = 'none';
        if (soundActiveIcon) soundActiveIcon.style.display = 'block';
        if (soundLabel) soundLabel.textContent = 'Mute';
      }
    });
  }

  function onVideoEnded() {
    if (videoTransitioned) return;
    videoTransitioned = true;
    isVideoPlaying = false;

    // Just after the video ends: swell music up to normal sound
    if (bgMusic) {
      fadeVolume(bgMusic, MUSIC_VOLUME_NORMAL, 1400);
    }

    transitionToMain();
  }

  // ============================================================
  // STAGE 2 → STAGE 3: TRANSITION TO MAIN WEBSITE & BACKGROUND MUSIC
  // ============================================================
  function transitionToMain() {
    // Fade out video stage
    videoStage.classList.add('fade-out');

    setTimeout(() => {
      videoStage.style.display = 'none';

      // Reveal main website
      mainStage.classList.add('visible');

      // Initialize background slideshow
      initSlideshow();

      // Ensure music is playing at normal volume
      if (!isMusicPlaying) {
        startBackgroundMusic(MUSIC_VOLUME_NORMAL);
      } else if (bgMusic) {
        fadeVolume(bgMusic, MUSIC_VOLUME_NORMAL, 1000);
      }
    }, 1000);
  }

  // ============================================================
  // BACKGROUND MUSIC PLAYBACK & CONTROLLER
  // ============================================================
  let isMusicPlaying = false;

  function setMusicPlayingState(playing) {
    isMusicPlaying = playing;
    if (playing) {
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'inline-block';
      if (musicText) musicText.textContent = 'Pause Music';
      if (musicToggleBtn) musicToggleBtn.setAttribute('aria-label', 'Pause background music');
    } else {
      if (iconPlay) iconPlay.style.display = 'inline-block';
      if (iconPause) iconPause.style.display = 'none';
      if (musicText) musicText.textContent = 'Play Music';
      if (musicToggleBtn) musicToggleBtn.setAttribute('aria-label', 'Play background music');
    }
  }

  function startBackgroundMusic(targetVolume = MUSIC_VOLUME_LOW) {
    if (!bgMusic) return;

    bgMusic.volume = targetVolume;

    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setMusicPlayingState(true);
        })
        .catch(() => {
          setMusicPlayingState(false);
        });
    }
  }

  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isMusicPlaying) {
        bgMusic.pause();
        setMusicPlayingState(false);
      } else {
        const targetVol = isVideoPlaying ? MUSIC_VOLUME_LOW : (videoTransitioned ? MUSIC_VOLUME_NORMAL : MUSIC_VOLUME_LOW);
        bgMusic.volume = targetVol;
        bgMusic.play()
          .then(() => {
            setMusicPlayingState(true);
          })
          .catch(() => {
            setMusicPlayingState(false);
          });
      }
    });
  }

  // ============================================================
  // AMBIENT SLIDESHOW
  // ============================================================
  function initSlideshow() {
    if (!slideshowTrack || IMAGE_FILES.length === 0) return;

    // Prevent duplicate injection
    if (slideshowTrack.children.length > 0) return;

    // Duplicate images for continuous loop
    const allImages = [...IMAGE_FILES, ...IMAGE_FILES];
    const fragment = document.createDocumentFragment();

    allImages.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Memory ${(i % IMAGE_FILES.length) + 1}`;
      img.loading = i < 4 ? 'eager' : 'lazy';
      img.decoding = 'async';
      fragment.appendChild(img);
    });

    slideshowTrack.appendChild(fragment);

    const totalDuration = IMAGE_FILES.length * SLIDESHOW_SPEED_SECONDS_PER_IMAGE;
    slideshowTrack.style.animation = `slideshowScroll ${totalDuration}s linear infinite`;
  }

  // ============================================================
  // LETTER MODAL — INTERACTION & ACCESSIBILITY
  // ============================================================
  function openModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (noteCard) noteCard.setAttribute('aria-expanded', 'true');
    if (modalCloseBtn) {
      setTimeout(() => modalCloseBtn.focus(), 100);
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (noteCard) {
      noteCard.setAttribute('aria-expanded', 'false');
      noteCard.focus();
    }
  }

  if (noteCard) {
    noteCard.addEventListener('click', openModal);
    noteCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

})();
