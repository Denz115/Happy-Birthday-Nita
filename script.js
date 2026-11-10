document.addEventListener("DOMContentLoaded", () => {
  const introPage = document.getElementById("intro-page");
  const bookPage = document.getElementById("book-page");
  const book = document.getElementById("book");
  const bgMusic = document.getElementById("bg-music");

  // ---  LOGIKA BUKA TIRAI RGB  ---
  const curtainOverlay = document.getElementById("curtain-overlay");
  const openCurtainBtn = document.getElementById("open-curtain-btn");

  if (openCurtainBtn && curtainOverlay) {
    openCurtainBtn.addEventListener("click", () => {
      curtainOverlay.classList.add("open");
      setTimeout(() => {
        curtainOverlay.style.display = "none";
      }, 1500);
    });
  }
  
  // ---  MESIN SUARA & FAIRY DUST  ---
  const penSound = document.getElementById("pen-sound");
  if (penSound) penSound.volume = 1.0; 

  function playPenSound() {
      if (penSound && penSound.paused) penSound.play().catch(e => console.log(e));
  }

  function pausePenSound() {
      if (penSound && !penSound.paused) penSound.pause();
  }

  function createFairyDust(cursorElement) {
      if (!cursorElement) return;
      const rect = cursorElement.getBoundingClientRect();
      if (rect.top === 0 && rect.left === 0) return;

      const dust = document.createElement("div");
      dust.className = "fairy-dust";
      
      const shapes = ['\u2726', '\u2605', '\u2728', '\u25CF'];
      dust.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];

      const colors = ['#FF00FF', '#00FFFF', '#39FF14'];
      dust.style.color = colors[Math.floor(Math.random() * colors.length)];

      const offsetX = (Math.random() * 20) - 10;
      const offsetY = (Math.random() * 20) - 10;
      
      dust.style.left = (rect.right + offsetX) + "px";
      dust.style.top = (rect.bottom + offsetY - 10) + "px"; 

      document.body.appendChild(dust);

      setTimeout(() => {
          if (dust.parentNode) dust.parentNode.removeChild(dust);
      }, 800);
  }

  // ---  MESIN KELOPAK BUNGA  ---
  let petalInterval;

  function startPetalRain() {
      const container = document.getElementById("petal-container");
      if (!container) return;
      const items = ['\uD83C\uDF38', '\uD83C\uDF3A', '\uD83C\uDF3C', '\uD83C\uDF3B', '\uD83D\uDCAE'];

      petalInterval = setInterval(() => {
          const petal = document.createElement('div');
          petal.className = 'petal';
          petal.innerHTML = items[Math.floor(Math.random() * items.length)];

          const startX = Math.random() * window.innerWidth;
          const duration = Math.random() * 5 + 4; 
          const size = Math.random() * 15 + 15; 
          const opacity = Math.random() * 0.4 + 0.3; 
          const rotation = (Math.random() - 0.5) * 360;

          petal.style.left = startX + 'px';
          petal.style.fontSize = size + 'px';
          petal.style.animationDuration = duration + 's';
          petal.style.setProperty('--op', opacity);
          petal.style.setProperty('--rot', rotation + 'deg');

          container.appendChild(petal);
          setTimeout(() => { if (petal.parentNode) petal.remove(); }, duration * 1000);
      }, 400); 
  }

  function stopPetalRain() {
      clearInterval(petalInterval);
      const container = document.getElementById("petal-container");
      if(container) container.innerHTML = ''; 
  }

  // ---  MESIN PENA PROLOG  ---
  const handwrittenTexts = document.querySelectorAll(".handwritten");
  handwrittenTexts.forEach(el => {
    el.dataset.original = el.innerHTML.trim(); 
    el.innerHTML = ""; 
  });

  let pCl = 0;
  let pIsDipping = false;
  let prologTypeTimeout;

  function resetPrologQuill() {
      const inkRect = document.getElementById("ink-station-prolog").getBoundingClientRect();
      const pageRect = bookPage.getBoundingClientRect();
      const quillProlog = document.getElementById("movingQuill-prolog");
      if (quillProlog && inkRect) {
          quillProlog.style.transition = "all 0.5s ease-in-out";
          quillProlog.style.left = (inkRect.left - pageRect.left + 25) + "px"; 
          quillProlog.style.top = (inkRect.top - pageRect.top - 10) + "px"; 
          quillProlog.classList.remove("writing-active");
      }
  }

  function updatePrologQuillPosition() {
      if (pIsDipping) return;
      const cursor = document.getElementById("pen-cursor-prolog");
      const quillProlog = document.getElementById("movingQuill-prolog");
      const pageRect = bookPage.getBoundingClientRect();
      if (cursor && quillProlog) {
          const rect = cursor.getBoundingClientRect();
          if (rect.top !== 0 && rect.left !== 0) {
              quillProlog.style.transition = "top 0.1s, left 0.1s, transform 0.4s ease-in-out";
              quillProlog.style.left = (rect.right - pageRect.left - 10) + "px"; 
              quillProlog.style.top = (rect.bottom - pageRect.top - 45) + "px"; 
          }
      }
  }

  function triggerPrologInkDip(onComplete) {
      pIsDipping = true;
      const quillProlog = document.getElementById("movingQuill-prolog");
      const inkRect = document.getElementById("ink-station-prolog").getBoundingClientRect();
      const pageRect = bookPage.getBoundingClientRect();
      document.getElementById("inkp2-prolog").style.visibility = "visible";

      quillProlog.style.transition = "left 0.5s ease-in-out, top 0.5s ease-in-out";
      quillProlog.style.left = (inkRect.left - pageRect.left + 5) + "px"; 
      quillProlog.style.top = (inkRect.top - pageRect.top - 45) + "px";  

      setTimeout(() => {
          quillProlog.style.transition = "none";
          quillProlog.classList.add("real-dipping");

          setTimeout(() => {
              pCl = 0; 
              document.getElementById("inkp2-prolog").style.visibility = "hidden";
              quillProlog.classList.remove("real-dipping");
              pIsDipping = false;
              updatePrologQuillPosition();
              if (onComplete) onComplete();
          }, 1400);
      }, 500);
  }

  function typeWriter(el, callback) {
    if (!el || el.dataset.typed === "true") {
      if (callback) callback();
      return; 
    }
    el.dataset.typed = "true";
    let html = el.dataset.original;
    let i = 0;
    el.innerHTML = "<span id='pen-cursor-prolog'>&#8203;</span>";
    
    const quillProlog = document.getElementById("movingQuill-prolog");

    function type() {
      if (i < html.length) {
        if (pIsDipping) return;

        if (pCl > 165 && html.charAt(i) === ' ') {
          quillProlog.classList.remove("writing-active");
          pausePenSound(); 
          triggerPrologInkDip(() => {
              prologTypeTimeout = setTimeout(type, 5);
          });
          return;
        }

        let char = html.charAt(i);
        if (char === '<') {
          quillProlog.classList.remove("writing-active");
          pausePenSound(); 
          let tag = "";
          while (html.charAt(i) !== '>' && i < html.length) {
            tag += html.charAt(i);
            i++;
          }
          tag += '>';
          i++; 
          const cursor = document.getElementById("pen-cursor-prolog");
          if(cursor) cursor.insertAdjacentHTML('beforebegin', tag);
          prologTypeTimeout = setTimeout(type, 10);
          return;
        }

        const cursor = document.getElementById("pen-cursor-prolog");
        let charSpan = `<span style="color: rgb(${pCl}, ${pCl}, ${pCl});">${char}</span>`;
        if(cursor) cursor.insertAdjacentHTML('beforebegin', charSpan);

        if (char === " ") {
          pCl += 22;
          quillProlog.classList.remove("writing-active");
          pausePenSound(); 
        } else {
          quillProlog.classList.add("writing-active");
          playPenSound(); 
          createFairyDust(document.getElementById("pen-cursor-prolog")); 
        }

        updatePrologQuillPosition();
        i++;
        prologTypeTimeout = setTimeout(type, 80); 
      } else {
        quillProlog.classList.remove("writing-active");
        pausePenSound(); 

        const cursor = document.getElementById("pen-cursor-prolog");
        if (cursor) cursor.remove();
        
        if (el.parentElement) {
          const stamp = el.parentElement.querySelector(".stamp");
          if (stamp) {
            stamp.classList.add("show-stamp");
          }
        }
        if (callback) callback();
      }
    }
    type();
  }

  // ---  TRANSISI HALAMAN BUKU  ---
  introPage.addEventListener("click", () => {
    bgMusic.play(); 
    introPage.style.opacity = "0";
    setTimeout(() => {
      introPage.classList.add("hidden");
      bookPage.classList.remove("hidden");
      void bookPage.offsetWidth;
      bookPage.style.opacity = "1";
      startPetalRain();
      resetPrologQuill(); 

      setTimeout(() => {
        typeWriter(document.querySelector("#f1 .handwritten"), () => {
            resetPrologQuill(); 
        });
      }, 600);
    }, 1000);
  });

  let currentLocation = 1;
  const numOfPapers = 8;
  const maxLocation = numOfPapers + 1;
  const papers = [
    document.getElementById("p1"), document.getElementById("p2"),
    document.getElementById("p3"), document.getElementById("p4"),
    document.getElementById("p5"), document.getElementById("p6"),
    document.getElementById("p7"), document.getElementById("p8"),
  ];
  
  function openBook(paper) {
    paper.classList.add("flipped");
    if (paper.id === "p1") paper.style.zIndex = 1;
    if (paper.id === "p2") paper.style.zIndex = 2;
    if (paper.id === "p3") paper.style.zIndex = 3;
    if (paper.id === "p4") paper.style.zIndex = 4;
    if (paper.id === "p5") paper.style.zIndex = 5;
    if (paper.id === "p6") paper.style.zIndex = 6;
    if (paper.id === "p7") paper.style.zIndex = 7;
    if (paper.id === "p8") paper.style.zIndex = 8;
  }

  book.addEventListener("click", () => {
    if (currentLocation < maxLocation) {
      const paper = papers[currentLocation - 1];
      openBook(paper);
      
      const currentBack = paper.querySelector(".back .handwritten");
      const nextPaper = papers[currentLocation];
      const nextFront = nextPaper ? nextPaper.querySelector(".front .handwritten") : null;
      
      clearTimeout(prologTypeTimeout);

      setTimeout(() => {
        typeWriter(currentBack, () => {
          typeWriter(nextFront, () => {
              resetPrologQuill(); 
          });
        });
      }, 400);

      currentLocation++;
    } else {
      document.getElementById("movingQuill-prolog").style.display = "none";
      pausePenSound(); 
      stopPetalRain();
      
      bookPage.style.opacity = "0";
      setTimeout(() => {
        bookPage.classList.add("hidden");
        const boxPage = document.getElementById("box-page");
        boxPage.classList.remove("hidden");
        void boxPage.offsetWidth;
        boxPage.style.opacity = "1";

        setTimeout(() => {
          const container = document.getElementById("photos-container");
          container.classList.add("box-open");

          setTimeout(() => {
            const nextBtn = document.getElementById("to-music-page");
            nextBtn.classList.remove("hidden");
            document.getElementById("photo-cluster").classList.add("spinning");
          }, 2000);
        }, 500);
      }, 1000);
    }
  });

  // ---  LOGIKA SWIPE FOTO  ---
  const flipInner = document.getElementById("lightbox-flip-inner");
  let startX = 0;

  if (flipInner) {
      flipInner.addEventListener("touchstart", (e) => {
          startX = e.changedTouches[0].clientX;
      });
      flipInner.addEventListener("touchend", (e) => {
          let endX = e.changedTouches[0].clientX;
          if (startX - endX > 40 || endX - startX > 40) {
              flipInner.classList.toggle("is-flipped");
          }
      });
  }

  // ---  TRANSISI MUSIC & VIDEO PAGE  ---
  const toMusicBtn = document.getElementById("to-music-page");
  const boxPage = document.getElementById("box-page");
  const musicPage = document.getElementById("music-page");
  const cassetteWrapper = document.getElementById("cassette-wrapper");
  const spotifyWrapper = document.getElementById("spotify-wrapper");
  const toVideoBtn = document.getElementById("to-video-page");
  const videoPage = document.getElementById("video-page");
  const videoButtons = document.getElementById("video-buttons");

  toMusicBtn.addEventListener("click", () => {
    bgMusic.pause(); 
    bgMusic.currentTime = 0;

    boxPage.style.opacity = "0";
    setTimeout(() => {
      boxPage.classList.add("hidden");
      musicPage.classList.remove("hidden");
      void musicPage.offsetWidth;
      musicPage.style.opacity = "1";

      setTimeout(() => {
        cassetteWrapper.classList.add("slide-out");
        spotifyWrapper.classList.remove("hidden");
        setTimeout(() => {
          spotifyWrapper.classList.add("slide-in");
          setTimeout(() => {
            toVideoBtn.classList.remove("hidden");
          }, 2000);
        }, 500);
      }, 1500); 
    }, 1000);
  });

  // ---  PLAYLIST LOGIC  ---
  const songItems = document.querySelectorAll(".song-item");
  const playlistAudio = document.getElementById("playlist-audio");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const seekBar = document.getElementById("seek-bar");
  const currentTimeEl = document.getElementById("current-time");
  const totalTimeEl = document.getElementById("total-time");
  let currentIndex = 0;

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) sec = `0${sec}`;
    return `${min}:${sec}`;
  }

  function loadAndPlaySong(index) {
    if (index < 0) index = songItems.length - 1;
    if (index >= songItems.length) index = 0;
    currentIndex = index;

    songItems.forEach(i => i.classList.remove("active"));
    const currentItem = songItems[currentIndex];
    currentItem.classList.add("active");

    const src = currentItem.getAttribute("data-src");
    playlistAudio.src = src;
    playlistAudio.play();
    playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  }

  songItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      loadAndPlaySong(index);
    });
  });

  playPauseBtn.addEventListener("click", () => {
    if (playlistAudio.paused) {
      if (!playlistAudio.src) {
        loadAndPlaySong(0);
      } else {
        playlistAudio.play();
        playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      }
    } else {
      playlistAudio.pause();
      playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }
  });

  prevBtn.addEventListener("click", () => loadAndPlaySong(currentIndex - 1));
  nextBtn.addEventListener("click", () => loadAndPlaySong(currentIndex + 1));

  playlistAudio.addEventListener("timeupdate", () => {
    if (playlistAudio.duration) {
      const progressPercent = (playlistAudio.currentTime / playlistAudio.duration) * 100;
      seekBar.value = progressPercent;
      currentTimeEl.innerText = formatTime(playlistAudio.currentTime);
      totalTimeEl.innerText = formatTime(playlistAudio.duration);
    }
  });

  seekBar.addEventListener("input", () => {
    playlistAudio.currentTime = playlistAudio.duration * (seekBar.value / 100);
  });

  playlistAudio.addEventListener("ended", () => {
    loadAndPlaySong(currentIndex + 1);
  });

  toVideoBtn.addEventListener("click", () => {
    playlistAudio.pause(); 
    playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    
    musicPage.style.opacity = "0";
    setTimeout(() => {
      musicPage.classList.add("hidden");
      videoPage.classList.remove("hidden");
      void videoPage.offsetWidth;
      videoPage.style.opacity = "1";

      setTimeout(() => {
        videoButtons.classList.remove("hidden");
      }, 8000);
    }, 1000);
  });

  // ---  LOGIKA PESAN SPESIAL AKHIR  ---
  const msgModal = document.getElementById("message-modal");
  const openMsgBtn = document.getElementById("open-message-btn");
  const closeMsgBtn = document.querySelector(".close-modal");
  const typedMessage = document.getElementById("typed-message");
  const secretMsg = document.getElementById("secret-msg").innerHTML;
  const movingQuill = document.getElementById("movingQuill");
  const scaleWrapper = document.getElementById("scale-wrapper");
  const inkStation = document.getElementById("ink-station");
  
  let p = 0;
  let cl = 0;
  let isDipping = false;
  let typeTimeout;
  let isBold = false; 
  let isPink = false; 

  function updateQuillPosition() {
      if (isDipping) return;
      const cursor = document.getElementById("pen-cursor");
      if (cursor) {
          const rect = cursor.getBoundingClientRect();
          const containerRect = scaleWrapper.getBoundingClientRect();
          if (rect.top !== 0 && rect.left !== 0) {
              const localRight = (rect.right - containerRect.left);
              const localBottom = (rect.bottom - containerRect.top);
              movingQuill.style.display = "block";
              movingQuill.style.left = (localRight - 25) + "px"; 
              movingQuill.style.top = (localBottom - 67) + "px"; 
          }
      }
  }

  function runTyping() {
      if (p >= secretMsg.length) {
          movingQuill.style.display = "none";
          movingQuill.classList.remove("writing-active");
          pausePenSound(); 
          return;
      }
      if (isDipping) return;
      let char = secretMsg.charAt(p);
      let speed = Math.random() * 50 + 110; 

      if (char === "<") {
          movingQuill.classList.remove("writing-active");
          pausePenSound(); 
          let av = secretMsg.indexOf(">", p);
          let tag = secretMsg.substring(p, av + 1);

          if (tag === "<strong>" || tag === "<b>") { isBold = true; p = av + 1; setTimeout(runTyping, 10); return; }
          if (tag === "</strong>" || tag === "</b>") { isBold = false; p = av + 1; setTimeout(runTyping, 10); return; }
          if (tag.includes("pink")) { isPink = true; p = av + 1; setTimeout(runTyping, 10); return; }
          if (tag === "</span>") { isPink = false; p = av + 1; setTimeout(runTyping, 10); return; }

          p = av;
          const cursor = document.getElementById("pen-cursor");
          if(cursor) cursor.insertAdjacentHTML('beforebegin', tag);
          p++;
          setTimeout(runTyping, 10);
          return;
      }

      const cursor = document.getElementById("pen-cursor");
      let fw = isBold ? "font-weight: bold;" : "";
      let fc = isPink ? "color: #ff1493; text-shadow: 0 0 5px rgba(255, 20, 147, 0.3);" : `color: rgb(${cl}, ${cl}, ${cl});`;
      let charSpan = `<span style="${fc} ${fw}">${char}</span>`;
      
      if(cursor) cursor.insertAdjacentHTML('beforebegin', charSpan);

      if (char === " ") {
          cl += 22; 
          movingQuill.classList.remove("writing-active"); 
          pausePenSound(); 
      } else {
          movingQuill.classList.add("writing-active"); 
          playPenSound(); 
          createFairyDust(document.getElementById("pen-cursor")); 
      }

      typedMessage.scrollTop = typedMessage.scrollHeight;
      updateQuillPosition();

      if (cl > 165) {
          isDipping = true;
          movingQuill.classList.remove("writing-active");
          pausePenSound(); 
          setTimeout(triggerInkDip, 200);
          return;
      }
      p++;
      typeTimeout = setTimeout(runTyping, speed);
  }

  function triggerInkDip() {
      document.getElementById("inkp2").style.visibility = "visible"; 
      const inkRect = inkStation.getBoundingClientRect();
      const containerRect = scaleWrapper.getBoundingClientRect();
      const localInkLeft = (inkRect.left - containerRect.left);
      const localInkTop = (inkRect.top - containerRect.top);

      movingQuill.style.transition = "left 0.5s ease-in-out, top 0.5s ease-in-out";
      movingQuill.style.left = (localInkLeft + 10) + "px"; 
      movingQuill.style.top = (localInkTop - 55) + "px";  

      setTimeout(() => {
          movingQuill.style.transition = "none"; 
          movingQuill.classList.add("real-dipping"); 
          setTimeout(() => {
              cl = 0; 
              document.getElementById("inkp2").style.visibility = "hidden";
              movingQuill.classList.remove("real-dipping");
              isDipping = false;
              p++;
              updateQuillPosition();
              setTimeout(runTyping, Math.random() * 50 + 110);
          }, 1400); 
      }, 500); 
  }

  function startWritingAnimation() {
      p = 0; cl = 0;
      typedMessage.innerHTML = "<span id='pen-cursor'>&#8203;</span>";
      isDipping = false; movingQuill.style.display = "none";
      runTyping();
  }

  openMsgBtn.addEventListener("click", () => {
    msgModal.classList.remove("hidden");
    setTimeout(() => {
      msgModal.classList.add("show");
      setTimeout(() => { startWritingAnimation(); }, 1500);
    }, 10);
  });

  closeMsgBtn.addEventListener("click", () => {
    msgModal.classList.remove("show");
    clearTimeout(typeTimeout);
    movingQuill.style.display = "none";
    pausePenSound(); 
    typedMessage.innerHTML = "";
    setTimeout(() => { msgModal.classList.add("hidden"); }, 400); 
  });

  msgModal.addEventListener("click", (e) => { if (e.target === msgModal) closeMsgBtn.click(); });
  document.getElementById("back-to-start").addEventListener("click", () => { location.reload(); });
  
  window.addEventListener('resize', () => {
      updatePrologQuillPosition();
      updateQuillPosition();
  });
});

// --- 🔥 FUNGSI GLOBAL LIGHTBOX, LEDAKAN HATI & EFEK TRAIL ORIGINAL 🔥 ---
let perimeterProgress = 0; 
let perimeterSpeed = 5; 
let rainbowHue = 0;
let isLightboxOpen = false;
let lightboxTrailAnimationId;

function getPerimeterCoordinates(p, w, h) {
    let x = 0, y = 0;
    if (p < w) { x = p; y = 0; } 
    else if (p < w + h) { x = w; y = p - w; } 
    else if (p < w + h + w) { x = w - (p - w - h); y = h; } 
    else { x = 0; y = h - (p - w - h - w); }
    return {x, y};
}

function createPerimeterTrail(x, y, isHead, hue, container) {
    let sparkle = document.createElement('div');
    sparkle.className = 'perimeter-sparkle';
    sparkle.style.left = x + 'px'; 
    sparkle.style.top = y + 'px';
    
    // Warna pelangi ala Mas Deden
    let color = 'hsl(' + hue + ', 100%, 50%)';
    
    // Inti garis (isHead) dipertahankan, sebaran debu di sekitarnya
    let size = isHead ? '12px' : (Math.random() * 6 + 4) + 'px';
    
    sparkle.style.width = size; 
    sparkle.style.height = size;
    sparkle.style.background = 'radial-gradient(circle, #fff 0%, ' + color + ' 50%, transparent 100%)';
    
    // Glow untuk kepala komet sedikit diterangkan agar jejak utamanya terlihat jelas
    sparkle.style.boxShadow = '0 0 ' + (isHead ? 25 : 10) + 'px ' + color;
    
    container.appendChild(sparkle);
    
    // 🔥 SAMAKAN WAKTU DENGAN CSS: 2500 milidetik (2.5 detik) 🔥
    setTimeout(() => { if(sparkle.parentNode) sparkle.remove(); }, 2500); 
}

function animatePerimeterTrail() {
    if (!isLightboxOpen) return;
    
    // 🔥 KUNCI 3D: Pasang cahayanya di flip-inner (kertasnya), bukan wadah luarnya 🔥
    const flipInner = document.getElementById("lightbox-flip-inner");
    if (!flipInner) return;

    perimeterProgress += perimeterSpeed;
    let w = flipInner.offsetWidth; 
    let h = flipInner.offsetHeight; 
    let totalLength = (w + h) * 2; 
    
    if (perimeterProgress > totalLength) perimeterProgress -= totalLength; 
    rainbowHue = (rainbowHue + 2) % 360; 
    
    // Trail 1
    let coords1 = getPerimeterCoordinates(perimeterProgress, w, h);
    createPerimeterTrail(coords1.x, coords1.y, true, rainbowHue, flipInner);
    for(let i = 0; i < 2; i++) {
        createPerimeterTrail(coords1.x + (Math.random()-0.5)*15, coords1.y + (Math.random()-0.5)*15, false, rainbowHue, flipInner);
    }
    
    // Trail 2
    let p2 = (perimeterProgress + totalLength / 2) % totalLength;
    let coords2 = getPerimeterCoordinates(p2, w, h);
    let hue2 = (rainbowHue + 180) % 360; 
    createPerimeterTrail(coords2.x, coords2.y, true, hue2, flipInner);
    for(let i = 0; i < 2; i++) {
        createPerimeterTrail(coords2.x + (Math.random()-0.5)*15, coords2.y + (Math.random()-0.5)*15, false, hue2, flipInner);
    }
    
    lightboxTrailAnimationId = requestAnimationFrame(animatePerimeterTrail);
}

function openLightbox(element, event) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxMsg = document.getElementById("lightbox-msg");
  const flipInner = document.getElementById("lightbox-flip-inner");
  const flash = document.getElementById("camera-flash");
  const cameraSound = document.getElementById("camera-sound");

  const img = element.querySelector("img");
  const msg = element.getAttribute("data-msg");

  if (lightboxImg) lightboxImg.src = img.src;
  if (lightboxMsg) lightboxMsg.innerHTML = msg;

  if (flipInner) flipInner.classList.remove("is-flipped");

  if(cameraSound) {
      cameraSound.currentTime = 0;
      cameraSound.play().catch(e => console.log(e));
  }
  
  if (flash) {
      flash.classList.add("flash-active");
      setTimeout(() => flash.classList.remove("flash-active"), 600);
  }

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  
  if (event && event.clientX) {
      x = event.clientX;
      y = event.clientY;
  } else if (event && event.changedTouches && event.changedTouches.length > 0) {
      x = event.changedTouches[0].clientX;
      y = event.changedTouches[0].clientY;
  }
  
  createHeartBurst(x, y);

  if (lightbox) {
      lightbox.classList.remove("hidden");
      
      // 🔥 NYALAKAN EFEK TRAIL KARYAMU 🔥
      isLightboxOpen = true;
      cancelAnimationFrame(lightboxTrailAnimationId);
      animatePerimeterTrail();
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.classList.add("hidden");
  
  // 🔥 MATIKAN EFEK TRAIL SAAT DITUTUP 🔥
  isLightboxOpen = false;
  cancelAnimationFrame(lightboxTrailAnimationId);
  document.querySelectorAll('.perimeter-sparkle').forEach(el => el.remove());
}

function createHeartBurst(x, y) {
  for(let i=0; i<15; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = "💖";
      heart.className = "burst-heart";
      document.body.appendChild(heart);

      heart.style.left = (x - 15) + "px";
      heart.style.top = (y - 15) + "px";

      const angle = Math.random() * Math.PI * 2;
      const velocity = 60 + Math.random() * 120;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 60; 

      heart.style.setProperty('--tx', tx + "px");
      heart.style.setProperty('--ty', ty + "px");

      setTimeout(() => {
          if(heart.parentNode) heart.remove();
      }, 1000);
  }
}
// =========================================================
// 🔥 TAMBAHAN BARU: SISTEM KEAMANAN ANTI-MALING KODE 🔥
// =========================================================

// 1. Mematikan fungsi Klik Kanan di seluruh website
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// 2. Mematikan jalan pintas Keyboard untuk melihat kode (Inspect Element, View Source, Save)
document.addEventListener('keydown', function(e) {
  // Blokir tombol F12 (DevTools)
  if (e.key === 'F12') {
      e.preventDefault();
  }
  // Blokir kombinasi Ctrl+U (View Source) dan Ctrl+S (Save Web)
  if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
  }
  // Blokir kombinasi Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect Element)
  if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
  }
});
