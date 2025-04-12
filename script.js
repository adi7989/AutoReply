function toggleDarkMode() {
  const body = document.body;
  const btn = document.getElementById("darkModeBtn");
  body.classList.toggle("dark-mode");
  btn.innerText = body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

function copyEmailContent() {
  const text = document.getElementById("emailInput").value;
  navigator.clipboard.writeText(text).then(() => alert("Email content copied!"));
}

 const wrapper = document.getElementById('wrapper');
  const generateBtn = document.getElementById('generateBtn');
  generateBtn.addEventListener('click', () => {
    wrapper.classList.add('two-columns');
  });


async function generateReply() {
  const emailInput = document.getElementById('emailInput');
  const imageInput = document.getElementById('imageInput');
  const tone = document.getElementById('toneSelect').value;
  const output = document.getElementById('output');
  const loader = document.getElementById('loader');
  const actions = document.getElementById('actions');
  const comments = document.getElementById('commentInput')?.value.trim();

  let inputText = emailInput.value.trim();

  // agar text absent hai, check if image is uploaded
  if (!inputText && imageInput?.files[0]) {
    inputText = await extractTextFromImage(imageInput.files[0]);
    if (inputText) {
      emailInput.value = inputText; // auto-fill extracted text
    } else {
      output.innerHTML = "Couldn't extract text from image.";
      return;
    }
  }

  if (!inputText) {
    output.innerHTML = "<p>Please enter some email content or upload a screenshot.</p>";
    return;
  }

  // Build prompt
  let prompt = `Generate a ${tone} reply to the following email:\n\n${inputText}`;
  if (comments) {
    prompt += `\n\nAdditional context/comments from user:\n${comments}`;
  }

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  output.innerHTML = "";
  loader.classList.remove("hidden");
  actions.classList.add("hidden");

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBnqmLJ42XV04c5V6XPSPsM6nBRhuQ4Zu4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply generated.";
    output.innerHTML = `<strong>AI Reply:</strong><br>${reply}`;
    actions.classList.remove("hidden");
  } catch (err) {
    output.innerHTML = "Something went wrong. Try again.";
  } finally {
    loader.classList.add("hidden");
  }
}

async function extractTextFromImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        // tesseract extract text
        Tesseract.recognize(
          img,
          'eng',
          {
            logger: (m) => console.log(m),
          }
        ).then(({ data: { text } }) => {
          resolve(text.trim());
        }).catch((err) => {
          console.error("Tesseract error:", err);
          reject("Error extracting text from image.");
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function copyReply() {
  const text = document.getElementById("output").innerText;
  navigator.clipboard.writeText(text).then(() => alert("Reply copied to clipboard!"));
}

tsParticles.load("tsparticles", {
  fullScreen: { enable: true },
  particles: {
    number: { value: 70 },
    size: { value: 3 },
    move: { enable: true, speed: 2, direction: "top" },
    line_linked: { enable: false },
    color: { value: ["#a78bfa", "#7dd3fc", "#f472b6", "#34d399"] },
    opacity: { value: 0.7 },
    shape: { type: "circle" }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "bubble" },
      onclick: { enable: true, mode: "repulse" }
    },
    modes: {
      bubble: { distance: 100, duration: 2, size: 6, opacity: 0.8 },
      repulse: { distance: 120 }
    }
  },
  detectRetina: true
});
