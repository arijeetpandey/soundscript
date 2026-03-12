const transcript = document.getElementById("transcript");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn")
const status = document.getElementById("status");

let recognition;
let isListening = false;

// Check browser support
if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
) {
    status.textContent =
        "Speech recognition not supported in this browser.";
    status.style.background = "#f8d7da";
    status.style.color = "#721c24";
    startBtn.disabled = true;
} else {
    // Initialize speech recognition
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    // Recognition settings
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // Handle recognition results
    recognition.onresult = function (event) {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcriptPart + " ";
            } else {
                interimTranscript += transcriptPart;
            }
        }

        transcript.value = finalTranscript || interimTranscript;
    };

    // Handle listening status
    recognition.onstart = function () {
        isListening = true;
        // startBtn.textContent = "🎤 Listening...";
        startBtn.classList.add("listening");
        stopBtn.disabled = false;
        // status.textContent = "Listening... Speak now!";
        status.classList.add("listening");
    };

    recognition.onend = function () {
        isListening = false;
        // startBtn.textContent = "🎤 ";
        startBtn.classList.remove("listening");
        stopBtn.disabled = true;
        status.classList.remove("listening");
        // status.textContent = "";
    };

    // Handle errors
    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        status.textContent = `Error: ${event.error}`;
        isListening = false;
        startBtn.classList.remove("listening");
        startBtn.textContent = "🎤";
        stopBtn.disabled = true;
    };

    // Button event listeners
    startBtn.addEventListener("click", function () {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    stopBtn.addEventListener("click", function () {
        recognition.stop();
    });

    clearBtn.addEventListener("click", function () {
        transcript.value = "";
        status.textContent = "";
    });
    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(transcript.value).then(() => {
        alert("Copied!" );
    });
    });

    // Allow textarea editing after recognition stops
    transcript.addEventListener("focus", function () {
        this.removeAttribute("readonly");
    });

    transcript.addEventListener("blur", function () {
        this.setAttribute("readonly", "readonly");
    });
}