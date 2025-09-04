/*
_____ _    _ _      _    __  __ ____  
  / ____| |  | | |    / \  |  \/  |  _ \ 
 | (___ | |  | | |   / _ \ | |\/| | | | |
  \___ \| |  | | |  / ___ \| |  | | |_| |
  ____) | |__| | |_/ /   \ \_|  |_|____/ 
 |_____/ \____/|_____/     \_\          
 
             S U L A - M D
*/

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const urls = [
  'https://sulaminideta-7e1382736da3.herokuapp.com/code/active',
  'https://freedom-443535f501b6.herokuapp.com/code/active',
  'https://sulaminideta5-b8bc2293d779.herokuapp.com/code/active'
];

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Code Count Viewer</title>
  <style>
    /* Reset & Base */
    body {
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(270deg, #1e3c72, #2a5298, #3a1c71);
      background-size: 600% 600%;
      animation: gradientShift 12s ease infinite;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      overflow: hidden;
    }

    /* Particle Background */
    .particles {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    /* Card */
    .card {
      position: relative;
      z-index: 1;
      background: rgba(30, 60, 114, 0.25);
      backdrop-filter: blur(12px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      padding: 40px 70px;
      border-radius: 20px;
      box-shadow: 0 0 25px rgba(0, 136, 255, 0.6);
      text-align: center;
      animation: floatCard 3s ease-in-out infinite;
    }

    .card h1 {
      font-size: 3rem;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #00d4ff, #008cff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: glow 2s ease-in-out infinite alternate;
    }

    .card p {
      font-size: 1.2rem;
      color: #b0cfff;
      opacity: 0.8;
      letter-spacing: 1px;
    }

    /* Animations */
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes glow {
      from { text-shadow: 0 0 5px #00d4ff, 0 0 10px #00d4ff; }
      to { text-shadow: 0 0 15px #00d4ff, 0 0 30px #008cff; }
    }

    @keyframes floatCard {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  </style>
</head>
<body>

  <!-- Particle Canvas -->
  <canvas class="particles" id="particles"></canvas>

  <!-- Floating Card -->
  <div class="card">
    <h1 id="count">0</h1>
    <p>𝚂𝚄𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 𝙲𝙾𝚄𝙽𝚃</p>
  </div>

  <script>
    // Count-Up Animation
    function animateValue(id, start, end, duration) {
      let obj = document.getElementById(id);
      let range = end - start;
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = Math.min((timestamp - startTime) / duration, 1);
        obj.textContent = Math.floor(progress * range + start);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    fetch('/code/active')
      .then(res => res.json())
      .then(data => animateValue("count", 0, data.totalCount, 2000))
      .catch(() => document.getElementById('count').textContent = 'Error');

    // Particle Effect
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  </script>

</body>
</html>

  `);
});

app.get('/code/active', async (req, res) => {
  try {
    const fetchPromises = urls.map(url =>
      fetch(url)
        .then(response => response.json())
        .catch(err => {
          console.error(`Error fetching from ${url}:`, err);
          return { count: 0 };
        })
    );
const results = await Promise.all(fetchPromises);
const totalCount = results.reduce((sum, data) => sum + (data.count || 0), 0);
    res.json({ totalCount });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ totalCount: 'Error fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
