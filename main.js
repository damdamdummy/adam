let currentPage = 1;
let maxPage = 7;
let isAnimating = false;

const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const nowPlayingEl = document.getElementById('nowPlaying');
const trackArtistEl = document.getElementById('trackArtist');
const volumeSlider = document.getElementById('volumeSlider');
const volumeDisplay = document.getElementById('volumeDisplay');

const playlist = [
    { title: "BONEBREAKER", artist: "SLAUGHTER TO PREVAIL", src: "./music/Bonebreaker.mp3" },
    { title: "I AM A LIAR", artist: "TOTHEGOOD", src: "./music/I AM A LIAR.mp3" },
    { title: "FREAK ON A LEASH", artist: "KORN", src: "./music/Freak On a Leash.mp3" },
    { title: "20 seconds : 20 minutes", artist: "Vein.fm", src: "./music/20 seconds  20 hours   Vein.mp3" },
    { title: "13STAIRS[-]1", artist: "THE GAZETTE", src: "./music/13STAIRS-1.mp3" },
    { title: "ABNORMALIZE", artist: "LING TOSITE SIGURE", src: "./music/abnormalize.mp3" },
    { title: "All Mine", artist: "Whirr", src: "./music/All Mine - Whirr.mp3" },
    { title: "Day / Day", artist: "AngelMaker", src: "./music/Day   AngelMaker.mp3" },
    { title: "Before I Forget", artist: "Slipknot", src: "./music/Before I Forget .mp3" },
    { title: "Cancer", artist: "My Chemical Romance", src: "./music/08 - Cancer.mp3" },
    { title: "Colorblind", artist: "Movements", src: "./music/Movements-Colorblind.mp3" },
    { title: "Snake Eyes", artist: "Sworn In", src: "./music/Snake Eyes   Sworn In.mp3" },
    { title: "Solace", artist: "Counterparts", src: "./music/Solace - Counterparts.mp3" },
    { title: "Fluorescent", artist: "Casey", src: "./music/Fluorescents   Casey.mp3" },
    { title: "CHANGE", artist: "DEFTONES", src: "./music/Change In the House of Flies.mp3" },
    { title: "WORDS I NEVER HAD THE STRENGTH TO TELL YOU", artist: "DEPARTMEFROMBEARISLAND", src: "./music/Words I Never Had The Strength To Tell You.mp3" },
    { title: "YOUR DEATH MAKES ME WISH HEAVEN WAS REAL", artist: "FRAIL BODY", src: "./music/ydmmwhwr.mp3" },
    { title: "UNDENIED", artist: "PORTISHEAD", src: "./music/Undenied.mp3" },
    { title: "Same As You Are", artist: "Pay money To my Pain", src: "./music/Pay money To my Pain – Same as you are.mp3" },
    { title: "TRUE", artist: "AKIRA YAMAOKA", src: "./music/True.mp3" }
];

let currentTrack = 0;
let isPlaying = false;

let touchStartX = null;
let touchStartY = null;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    const isInsideScrollable = e.target.closest('.page-content') || e.target.closest('.playlist-archive');

    if (isInsideScrollable) {
        touchStartX = null;
        touchStartY = null;
    } else {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }
}, { passive: true });

document.addEventListener('touchend', e => {
    if (touchStartX !== null && touchStartY !== null) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }
}, { passive: true });

function handleSwipe() {
    if (touchStartX === null || touchStartY === null) return;

    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);


    if (Math.abs(diffX) > swipeThreshold && diffY < 100 && currentPage > 0) {
        if (diffX > 0 && currentPage < maxPage) {
            nextPage();
        } else if (diffX < 0 && currentPage > 1) {
            prevPage();
        }
    }
}


function openBook() {
    const page0 = document.getElementById('page0');
    page0.classList.add('turning-forward');

    setTimeout(() => {
        page0.style.display = 'none';
        currentPage = 1;
        showPage(1);
        document.getElementById('prevBtnSide').style.display = 'block';
        document.getElementById('nextBtnSide').style.display = 'block';
    }, 1000);
}


function showPage(pageNum) {
    for (let i = 0; i <= maxPage; i++) {
        const page = document.getElementById(`page${i}`);
        if (page) {
            page.style.display = i === pageNum ? 'block' : 'none';
            page.classList.remove('turning-forward', 'turning-backward');
        }
    }

    currentPage = pageNum;
    document.getElementById('prevBtnSide').disabled = pageNum === 1;
    document.getElementById('nextBtnSide').disabled = pageNum === maxPage;
}

function nextPage() {
    if (currentPage < maxPage && !isAnimating) {
        isAnimating = true;
        const currentPageEl = document.getElementById(`page${currentPage}`);
        currentPageEl.classList.add('turning-forward');

        setTimeout(() => {
            showPage(currentPage + 1);
            isAnimating = false;
        }, 1000);
    }
}

function prevPage() {
    if (currentPage > 1 && !isAnimating) {
        isAnimating = true;
        const prevPageEl = document.getElementById(`page${currentPage}`);
        prevPageEl.classList.add('turning-backward');

        setTimeout(() => {
            showPage(currentPage - 1);
            isAnimating = false;
        }, 1000);
    }
}

document.getElementById('sendMessageBtn').addEventListener('click', async function () {
    const text = document.getElementById('messageInput').value.trim();
    const name = document.getElementById('senderName').value.trim() || 'ANONYMOUS';

    if (text) {
        this.textContent = 'SENDING...';
        this.style.opacity = '0.5';

        const success = await window.sendMessage(name, text);

        document.getElementById('messageInput').value = '';
        document.getElementById('senderName').value = '';

        if (success) {
            this.textContent = '✓ SENT';
            setTimeout(() => {
                this.textContent = 'SEND';
                this.style.opacity = '1';
                window.loadMessages();
            }, 2000);
        } else {
            this.textContent = '✗ FAILED';
            setTimeout(() => {
                this.textContent = 'SEND';
                this.style.opacity = '1';
            }, 2000);
        }
    }
});

function openLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    nowPlayingEl.textContent = track.title;
    trackArtistEl.textContent = track.artist;
    currentTrack = index;
    updateTrackHighlight();
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶';
        isPlaying = false;
    } else {
        audio.play();
        playBtn.textContent = '❚❚';
        isPlaying = true;
    }
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play();
}

function initPlaylist() {
    const container = document.getElementById('playlistContainer');
    playlist.forEach((track, index) => {
        const trackEl = document.createElement('div');
        trackEl.className = 'track-item';
        trackEl.innerHTML = `${index + 1}. ${track.title} <span style="color: #888; font-size: 0.8rem;">- ${track.artist}</span>`;
        trackEl.onclick = () => playTrack(index);
        container.appendChild(trackEl);
    });
}

function playTrack(index) {
    currentTrack = index;
    loadTrack(index);
    audio.play();
    isPlaying = true;
    playBtn.textContent = '❚❚';
}

function updateTrackHighlight() {
    const tracks = document.querySelectorAll('.track-item');
    tracks.forEach((track, index) => {
        if (index === currentTrack && isPlaying) {
            track.classList.add('active');
        } else {
            track.classList.remove('active');
        }
    });
}

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
    updateTrackHighlight();
});

audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', nextTrack);

volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value;
    volumeDisplay.textContent = volume;
    audio.volume = volume / 100;
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentPage > 0 && currentPage < maxPage) {
        nextPage();
    } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        prevPage();
    }
});

initPlaylist();
loadTrack(0);
audio.volume = 0.7;

document.addEventListener('DOMContentLoaded', () => {
    showPage(1);
    document.getElementById('prevBtnSide').style.display = 'block';
    document.getElementById('nextBtnSide').style.display = 'block';
});