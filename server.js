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

const urls = ['https://anglemini-c0a8e0724bad.herokuapp.com/code/active'];

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ANGEL MINI BOT COUNT</title>
  <style>
    /* Base Reset */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: radial-gradient(circle at center, #000 20%, #1a0000 100%);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      overflow: hidden;
    }

    /* Particle Background */
    .particles {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    /* Dragon Card */
    .card {
      position: relative;
      z-index: 1;
      background: rgba(20, 0, 0, 0.6);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 50, 50, 0.7);
      padding: 40px 60px;
      border-radius: 20px;
      box-shadow: 0 0 30px rgba(255, 0, 0, 0.8), inset 0 0 20px rgba(255, 0, 0, 0.4);
      text-align: center;
      animation: pulseAura 4s infinite alternate ease-in-out;
    }

    .card h1 {
      font-size: 4rem;
      margin-bottom: 15px;
      background: linear-gradient(90deg, #ff1e1e, #ff6a00, #ff1e1e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: fireFlicker 1.5s infinite alternate;
    }

    .card p {
      font-size: 1.4rem;
      color: #ffb3b3;
      text-transform: uppercase;
      letter-spacing: 3px;
      animation: fadeIn 3s ease-in-out infinite alternate;
    }

    /* Animations */
    @keyframes pulseAura {
      0% { box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), inset 0 0 10px rgba(255, 0, 0, 0.4); }
      100% { box-shadow: 0 0 60px rgba(255, 20, 20, 1), inset 0 0 25px rgba(255, 50, 50, 0.6); }
    }

    @keyframes fireFlicker {
      0% { text-shadow: 0 0 10px #ff3300, 0 0 25px #ff1e00; }
      100% { text-shadow: 0 0 25px #ff6600, 0 0 50px #ff0000; }
    }

    @keyframes fadeIn {
      from { opacity: 0.6; letter-spacing: 2px; }
      to { opacity: 1; letter-spacing: 4px; }
    }

    /* Responsive */
    @media (max-width: 600px) {
      .card {
        padding: 25px 30px;
      }
      .card h1 {
        font-size: 2.5rem;
      }
      .card p {
        font-size: 1rem;
      }
    }
  </style>
</head>
<body>

  <!-- Particle Canvas -->
  <canvas class="particles" id="particles"></canvas>

  <!-- Dragon Card -->
  <div class="card">
    <h1 id="count">0</h1>
    <p>ANGEL MINI BOT COUNT</p>
  </div>

  <script>
    // Count Animation
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
      .then(data => animateValue("count", 0, data.totalCount, 2500))
      .catch(() => document.getElementById('count').textContent = '🔥Error🔥');

    // Dragon Flame Particles
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 1.2,
        dy: (Math.random() - 0.5) * 1.2,
        color: `rgba(${200 + Math.random()*55}, ${Math.random()*50}, 0, 0.9)`
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
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
