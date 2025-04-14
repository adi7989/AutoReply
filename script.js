

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
 
  const isDark = body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
 }
 
 window.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("theme") === "dark";
  const body = document.body;
 
  if (isDark) {
   body.classList.add("dark-mode");
  }

  body.classList.add("no-transition");
  setTimeout(() => {
   body.classList.remove("no-transition");
  }, 50);
 });
 
 document.getElementById("darkModeBtn").addEventListener("click", toggleDarkMode);
 

function copyEmailContent() {
 const text = document.getElementById("emailInput").value;
 navigator.clipboard.writeText(text).then(() => alert("Email content copied!"));
}

const wrapper = document.getElementById('wrapper');
 const generateBtn = document.getElementById('generateBtn');
 generateBtn.addEventListener('click', () => {
   wrapper.classList.add('two-columns');
 });

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


//file upload check
const fileInput = document.getElementById('imageInput');
const fileNameDisplay= document.getElementById('fileName');

fileInput.addEventListener('change', function() {
 if(fileInput.files.length > 0) {
   fileNameDisplay.textContent=`Selected: ${fileInput.files[0].name}`;}
 else{
   fileNameDisplay.textContent='No file selected.';}
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


//extarct text from the ss
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


//sending gmail

  emailjs.init("uGk-AyTq4jC_2kDRM"); 


  function sendGeneratedReply() {

    document.getElementById("emailInputs").style.display = "block";

    const replyText = document.getElementById("output").innerText.replace("AI Reply:", "").trim();
   // const senderEmail = document.getElementById('senderEmail').value.trim();
    const receiverEmail = document.getElementById('receiverEmail').value.trim();
  
    if (emailInputsvisible&&(!replyText || !receiverEmail)) {
      showMessage("Please ensure a reply is generated and both emails are filled out.");
      return;
    }
  
    emailjs.send("service_9najibj", "template_tj5yh3r", {
      //from_email: senderEmail,
      to_email: receiverEmail,
      message: replyText
    }).then(function (res) {
      alert('Reply sent to recipient successfully!');
    }, function (err) {
      console.error(err);
      alert('Failed to send email via EmailJS.');
    });
  }

  function showMessage(message) {
    const messageBox=document.getElementById("messageBox");
    messageBox.innerText = message;
    messageBox.classList.remove("hidden");
  }
  
  

