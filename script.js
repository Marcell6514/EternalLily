// Deklarasi Elemen
const pinIn = document.getElementById('pin-entry');
const pinGate = document.getElementById('pin-gate');
const bgMusic = document.getElementById('bg-music');
const singVid = document.getElementById('sing-vid');
const easterVid = document.getElementById('easter-vid');

/* ========================================================
   0. ANIMASI KURSOR LEGENDARY (Jejak Love & Ledakan Bunga)
======================================================== */
// Efek Jejak Love (Trailing Hearts) saat mouse gerak
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.15) return; // Biar gak lag

    const heart = document.createElement('i');
    heart.className = 'fa-solid fa-heart trailing-heart';
    heart.style.left = e.pageX + 'px';
    heart.style.top = e.pageY + 'px';
    
    const size = Math.random() * 15 + 10;
    heart.style.fontSize = size + 'px';
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
});

// Efek Bunga Meledak saat diklik
document.addEventListener('click', (e) => {
    // Jangan meledak kalau ngeklik video, tombol, atau navigasi
    if (e.target.closest('video') || e.target.closest('button') || e.target.closest('.nav-item') || e.target.closest('.quiz-btn')) return;

    const particleCount = 12; // Jumlah partikel bunga pink

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('i');
        particle.className = 'fa-solid fa-spa burst-particle';
        particle.style.color = '#FFB7C5'; // Warna pink bunga
        particle.style.left = e.pageX + 'px';
        particle.style.top = e.pageY + 'px';

        const angle = Math.random() * Math.PI * 2;
        const velocity = 40 + Math.random() * 60;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        const size = Math.random() * 12 + 6;
        particle.style.fontSize = size + 'px';

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
});

/* ========================================================
   1. PIN & MULAI
======================================================== */
pinIn.addEventListener('input', (e) => {
    if(e.target.value === '9913') {
        pinGate.style.opacity = '0';
        setTimeout(() => {
            pinGate.style.display = 'none';
            document.getElementById('nav-bar').style.display = 'flex';
            document.getElementById('main-content').style.display = 'block';
            bgMusic.play();
            startTimer();
            createLeaves();
        }, 800);
    }
});

/* ========================================================
   2. NAVIGASI
======================================================== */
function changePage(pageId) {
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active-page');
    });
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active-nav');
    });

    document.getElementById(pageId).classList.add('active-page');
    event.currentTarget.classList.add('active-nav');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ========================================================
   3. AUDIO & DAUN & TIMER & GAME
======================================================== */
function duckVolume(isDucking) {
    bgMusic.volume = isDucking ? 0.15 : 1.0;
}
[singVid, easterVid].forEach(v => {
    v.onplay = () => duckVolume(true);
    v.onpause = () => duckVolume(false);
    v.onended = () => duckVolume(false);
});

function createLeaves() {
    const box = document.getElementById('leaf-box');
    for(let i=0; i<25; i++) {
        let leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.animationDuration = (Math.random() * 4 + 4) + 's';
        leaf.style.animationDelay = Math.random() * 5 + 's';
        box.appendChild(leaf);
    }
}

function startTimer() {
    const start = new Date('2026-04-26T00:00:00').getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const diff = now - start;
        if(diff < 0) {
            document.getElementById('timer').innerText = "Menunggu 26 April 2026...";
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        document.getElementById('timer').innerText = `${d} Hari ${h} Jam ${m} Menit`;
    }, 1000);
}

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let score = 0, items = [], gameRunning = false;

function startGame() { 
    items = []; score = 0; gameRunning = true; 
    document.getElementById('score').innerText = score;
    canvas.width = canvas.parentElement.clientWidth - 40; 
    loop(); 
}
function loop() {
    if(!gameRunning) return;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    if(Math.random() < 0.04) items.push({x: Math.random()*canvas.width, y: 0});
    items.forEach((it, i) => {
        it.y += 2.5; 
        ctx.fillStyle = "#FFB7C5";
        ctx.beginPath(); ctx.arc(it.x, it.y, 12, 0, Math.PI*2); ctx.fill();
        if(it.y > canvas.height) items.splice(i, 1);
    });
    requestAnimationFrame(loop);
}
canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    items.forEach((it, i) => {
        if(Math.hypot(it.x-x, it.y-y) < 25) { 
            items.splice(i, 1); score++;
            document.getElementById('score').innerText = score;
        }
    });
};

/* ========================================================
   4. EASTER EGG VIDEO
======================================================== */
let clicks = 0;
const overlay = document.getElementById('secret-overlay');
const closeBtn = document.getElementById('close-secret');

document.getElementById('lily-icon').onclick = () => {
    clicks++;
    if(clicks === 3) {
        overlay.style.display = 'block';
        easterVid.play();
        clicks = 0; 
    }
};
easterVid.onended = () => { overlay.style.display = 'none'; };
closeBtn.onclick = () => {
    overlay.style.display = 'none';
    easterVid.pause(); easterVid.currentTime = 0; 
};

/* ========================================================
   5. LOGIKA KUIS (3 PERTANYAAN)
======================================================== */
function checkQuiz(step, isCorrect) {
    if(isCorrect) {
        // Sembunyikan soal saat ini
        document.getElementById(`quiz-${step}`).style.display = 'none';
        
        // Cek apakah ada pertanyaan selanjutnya
        if(step < 3) {
            document.getElementById(`quiz-${step + 1}`).style.display = 'block';
        } else {
            // Kalau step 3 benar, tampilkan sukses
            document.getElementById('quiz-success').style.display = 'block';
        }
    } else {
        alert("Salah sayang, masa lupa sih? Coba ingat-ingat lagi! 🥺");
    }
}

/* ========================================================
   6. VOUCHER KE WHATSAPP
======================================================== */
function claimVoucher(voucherName) {
    // Munculkan alert konfirmasi
    let confirmClaim = confirm(`Kamu mau pakai voucher "${voucherName}" sekarang?`);
    
    // Kalau dia klik "OK" / Yes
    if (confirmClaim) {
        // Bikin teks pesan buat dikirim ke WA
        let message = `Sayang, aku mau claim voucher "${voucherName}" nih! Kapan kita berangkat? 🥺`;
        
        // Nomor WA kamu (083100818881 diubah ke format +62)
        let waUrl = `https://wa.me/6283100818881?text=${encodeURIComponent(message)}`;
        
        // Buka link WhatsApp di tab/aplikasi baru
        window.open(waUrl, '_blank');
    }
}