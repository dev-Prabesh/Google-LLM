// ...............................................................

// click_to_convert.addEventListener('click',function(){
//     var speech = true;
//     window.SpeechRecognition = window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.interimResults = true;
//     recognition.addEventListener('result', e=>{
//     const transcript = Array.from(e.results)
//     .map(result =>result[0])
//     .map(result => result.transcript)
//     convertText.innerHTML = transcript;
//     })
//     if(speech == true) {
//     recognition.start();
//     }
//     })





let recognition; // Declare recognition outside to reuse it

document.getElementById('click_to_convert').addEventListener('click', function () {
    if (!recognition) {
        // Create a new SpeechRecognition instance only if it doesn't already exist
        window.SpeechRecognition = window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.interimResults = true;

        recognition.addEventListener('result', (e) => {
            const transcript = Array.from(e.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join(""); // Join all results
            document.getElementById('convertText').value = transcript; // Update <textarea>
        });

        recognition.addEventListener('end', () => {
            recognition = null; // Reset instance to allow re-creation
        });
    }

    // Start recognition if it's not active
    try {
        recognition.start();
    } catch (error) {
        console.error('Error restarting recognition:', error);
    }
});






















// click_to_convert.addEventListener('click', function () {
//     const speech = true;
//     window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

//     if (!window.SpeechRecognition) {
//         alert("Speech Recognition is not supported in this browser.");
//         return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.interimResults = true;
//     recognition.continuous = true; // Keep the microphone open for continuous input

//     // Handle speech results
//     recognition.addEventListener('result', (e) => {
//         const transcript = Array.from(e.results)
//             .map(result => result[0])
//             .map(result => result.transcript)
//             .join('');
//         convertText.innerHTML = transcript;
//     });

//     // Restart speech recognition when it stops
//     recognition.addEventListener('end', () => {
//         if (speech) recognition.start();
//     });

//     // Start recognition
//     if (speech) {
//         recognition.start();
//     }
// });

// ..........................................

