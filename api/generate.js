<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Infinite Tsukuyomi</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Montserrat', sans-serif;
      min-height: 100dvh;
      background: linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%);
      background-size: 400% 400%;
      animation: gradientFlow 18s ease infinite;
    }
    @keyframes gradientFlow {
      0% {background-position: 0% 50%;}
      50% {background-position: 100% 50%;}
      100% {background-position: 0% 50%;}
    }
    .glass {
      background: rgba(255,255,255,0.25);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      backdrop-filter: blur(8.5px);
      -webkit-backdrop-filter: blur(8.5px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .lds-ring {display:inline-block;position:relative;width:80px;height:80px;}
    .lds-ring div {box-sizing:border-box;display:block;position:absolute;width:64px;height:64px;margin:8px;border:8px solid #fff;border-radius:50%;animation:lds-ring 1.2s cubic-bezier(0.5,0,0.5,1) infinite;border-color:#fff transparent transparent transparent;}
    .lds-ring div:nth-child(1){animation-delay:-0.45s;} .lds-ring div:nth-child(2){animation-delay:-0.3s;} .lds-ring div:nth-child(3){animation-delay:-0.15s;}
    @keyframes lds-ring {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}
  </style>
</head>
<body class="flex items-center justify-center p-4">
  <main id="app" class="glass w-full max-w-md p-6 text-gray-800"></main>

  <template id="question-template">
    <div class="space-y-6">
      <h2 id="question" class="text-xl font-semibold text-center"></h2>
      <div id="options" class="grid gap-4"></div>
      <button id="nextBtn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50" disabled>Next</button>
    </div>
  </template>

  <template id="result-template">
    <div class="space-y-6 text-center">
      <h2 class="text-2xl font-bold">Step into Your Dream Reality</h2>
      <p>One more step ✨ — let the world see the <span class="font-semibold">real</span> you.</p>
      <div id="cameraWrapper" class="space-y-4">
        <video id="video" playsinline autoplay class="rounded-xl mx-auto shadow-lg"></video>
        <button id="snapBtn" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg">Capture Selfie</button>
      </div>
      <canvas id="canvas" class="hidden"></canvas>
      <img id="dreamImage" class="hidden mx-auto rounded-xl shadow-lg"/>
      <div id="loader" class="hidden flex flex-col items-center justify-center space-y-2">
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        <p class="text-sm">Conjuring your Infinite Tsukuyomi…</p>
      </div>
      <div id="dreamMsg" class="hidden space-y-2">
        <h3 class="text-xl font-semibold">✨ Behold your Infinite Tsukuyomi ✨</h3>
        <p class="text-sm">Screenshot or share to manifest this vision into existence.</p>
      </div>
    </div>
  </template>

  <script>
    const app = document.getElementById('app');
    const qTpl = document.getElementById('question-template');
    const rTpl = document.getElementById('result-template');

    const quiz = {
      current: 0,
      answers: [],
      questions: [
        { q: 'Which setting feels most like home?', options: ['Ocean-front villa', 'Mountain cabin', 'Futuristic city loft', 'Quiet countryside farm'] },
        { q: 'You wake up greeted by…', options: ['Sound of waves', 'Birdsong in the forest', 'City skyline at sunrise', 'Rolling fields & dew'] },
        { q: 'Your perfect morning ritual is…', options: ['Yoga & meditation', 'Journaling with coffee', 'High-energy workout', 'Slow breakfast with loved ones'] },
        { q: 'Pick a creative outlet:', options: ['Writing stories', 'Designing products', 'Cooking gourmet meals', 'Painting landscapes'] },
        { q: 'Which companion energizes you most?', options: ['Soulmate partner', 'Tight-knit friends', 'Solo adventures', 'Loyal pet'] },
        { q: 'Your ideal work style?', options: ['Remote & flexible', 'Leading a visionary team', 'Hands-on craftsmanship', 'Research & discovery'] },
        { q: 'How do you give back?', options: ['Mentoring youth', 'Environmental activism', 'Innovating for humanity', 'Community volunteering'] },
        { q: 'Your dream travel mode:', options: ['Private sailboat', 'Camper van', 'Teleport pads (why not?)', 'First-class rail'] },
        { q: 'Pick a soundtrack vibe:', options: ['Lo-fi chillhop', 'Epic orchestral', 'Retro synthwave', 'Acoustic folk'] },
        { q: 'Final touch — choose a mantra:', options: ['Flow like water', 'Build boldly', 'Wander & wonder', 'Love grows here'] }
      ]
    };

    function renderQuestion() {
      app.innerHTML = '';
      const node = qTpl.content.cloneNode(true);
      const qEl = node.getElementById('question');
      const opts = node.getElementById('options');
      const nextBtn = node.getElementById('nextBtn');

      const currentQ = quiz.questions[quiz.current];
      qEl.textContent = `Question ${quiz.current + 1} of 10 — ${currentQ.q}`;

      currentQ.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = 'option w-full bg-white/70 hover:bg-white text-gray-800 py-2 rounded-lg shadow-sm';
        btn.addEventListener('click', () => {
          [...opts.children].forEach(b => b.classList.remove('ring', 'ring-indigo-500'));
          btn.classList.add('ring', 'ring-indigo-500');
          quiz.answers[quiz.current] = opt;
          nextBtn.disabled = false;
        });
        opts.appendChild(btn);
      });

      nextBtn.addEventListener('click', () => {
        if (quiz.current < quiz.questions.length - 1) {
          quiz.current++;
          renderQuestion();
        } else {
          renderResult();
        }
      });

      app.appendChild(node);
    }

    async function renderResult() {
      app.innerHTML = '';
      const node = rTpl.content.cloneNode(true);
      const video = node.getElementById('video');
      const snapBtn = node.getElementById('snapBtn');
      const canvas = node.getElementById('canvas');
      const dreamImg = node.getElementById('dreamImage');
      const loader = node.getElementById('loader');
      const dreamMsg = node.getElementById('dreamMsg');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        video.srcObject = stream;
      } catch (err) {
        console.error('Camera access denied:', err);
        snapBtn.disabled = true;
        snapBtn.textContent = 'Camera unavailable';
      }

      snapBtn.addEventListener('click', async () => {
        const w = video.videoWidth;
        const h = video.videoHeight;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);
        video.srcObject.getTracks().forEach(t => t.stop());
        video.classList.add('hidden');
        snapBtn.classList.add('hidden');

        const selfieDataUrl = canvas.toDataURL('image/png');
        loader.classList.remove('hidden');

        try {
          const generatedUrl = await generateDreamImage(selfieDataUrl, quiz.answers);
          dreamImg.src = generatedUrl;
          dreamImg.classList.remove('hidden');
          dreamMsg.classList.remove('hidden');
        } catch (e) {
          alert('Could not generate dream image — please try again.');
        } finally {
          loader.classList.add('hidden');
        }
      });

      app.appendChild(node);
    }

    async function generateDreamImage(selfieDataUrl, answers) {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selfie: selfieDataUrl, answers })
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      return data.generatedImageUrl;
    }

    renderQuestion();
  </script>
</body>
</html>



