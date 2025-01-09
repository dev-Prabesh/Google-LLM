const messageInput = document.querySelector(".message-input")
const chatBody = document.querySelector(".chat-body")
const sendMessageButton = document.querySelector("#send-message")
const fileInput = document.querySelector("#file-input")
const fileUploadWrapper = document.querySelector(".file-upload-wrapper")
const fileCancelButton = document.querySelector("#file-cancel")
const chatbotToggler = document.querySelector("#chatbot-toggler")
const closeIcon = document.querySelector("#close-chatbot")
const chatBox = document.querySelector(".chatbot-popup")
let microphone = document.querySelector("#click_to_convert")



let speech = new SpeechSynthesisUtterance();
let voices = [];


let hidechat = document.querySelector(".hidechatmenu")
let thepopup = document.querySelector(".thepopup")

hidechat.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot")
})




// api setup
const API_KEY = "AIzaSyAIRafwTy6fxWk66uTllTQ_pNkMSh8w7e0";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;



const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null,
    }
}

//changind the default voices
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.rate = 0.9; // Default is 1.0; adjust as needed
    speech.voice = voices[4];
};


// create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}


let tru = false;
microphone.addEventListener("click", () => {
    tru = true;
    console.log(tru)
})

// generate bot response using api
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");


    //api request options
    const requestOptions = {
        method: "POST",
        headers: { "content-Type": "applicaiton/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])]
            }]
        })
    }

    try {
        // fetch bot response from api
        const response = await fetch(API_URL, requestOptions)
        const data = await response.json();

        if (!response.ok) throw new Error(data.error.message)
        console.log(data)



        //extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;
        console.log(apiResponseText)

        //may be should remove.................
        runEvent(data);

        function runEvent(data) {
            // console.log(data)
            // speech.text = apiResponseText;
            // window.speechSynthesis.speak(speech);

            console.log('Event triggered with data:', data);
            console.log(data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim())
            speech.text = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            window.speechSynthesis.cancel();

            if (tru === true) {
                console.log(tru)
                window.speechSynthesis.speak(speech);
                tru = false;
            }

            // Add your event logic here
        }
        //may be should remove closed............

        //handeling speech for long time
        // Split the text into chunks


        //closed handeling speech for long time


    } catch (error) {
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000"
        console.log(error)
    } finally {
        // Reset user's file data, removing thinking indicator and scroll chat ot bottom
        userData.file = {};
        incomingMessageDiv.classList.remove("thinking")
        chatBody.scrollTo({ top: chatBody.scrollHeight, behaviour: "smooth" });
    }
}


// function runEvent(data) {
//     console.log('Event triggered with data:', data);
//     // Add your event logic here
//   }
//   runEvent()





// handle outgoing use messages
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    console.log(userData.message)
    console.log(messageInput.value)
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");


    // create and display user message
    const messageContent = `<div class="message-text"></div> ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");

    let modifiedInput = document.createElement("span"); // Create a span element
    modifiedInput.style.display = "none"; // Make it invisible
    modifiedInput.textContent = ", I want response in just a two sentences."; // Add the text

    // Update the text of the message
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    outgoingMessageDiv.querySelector(".message-text").appendChild(modifiedInput); // Append the hidden span

    chatBody.appendChild(outgoingMessageDiv); // Add the message to the chat body

    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" }); // Smooth scrolling

    // let modifiedInput = ", I want response in just a two sentences.";
    // modifiedInput.style.display = "none";

    // outgoingMessageDiv.querySelector(".message-text").textContent = userData.message + modifiedInput
    // chatBody.appendChild(outgoingMessageDiv);

    // chatBody.scrollTo({ top: chatBody.scrollHeight, behaviour: "smooth" });



    //simulate bot response with thinking indicator after a delay
    setTimeout(() => {
        const messageContent = `<svg class="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                    viewBox="0 0 1024 1024">
                    <path
                        d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z">
                    </path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behaviour: "smooth" });
        chatBody.appendChild(incomingMessageDiv);
        generateBotResponse(incomingMessageDiv);
    }, 600)

}

// handling keypress for sending messages
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage) {
        handleOutgoingMessage(e)
        messageInput.value = "";
    }
})


//handle file input change and preview the selected file
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    console.log(file)
    const reader = new FileReader();

    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded")
        const base64String = e.target.result.split(",")[1]

        //Store file data in userData
        userData.file = {
            data: base64String,
            mime_type: file.type
        }
        fileInput.value = "";


    }
    reader.readAsDataURL(file)


})








// Cancel file upload
fileCancelButton.addEventListener("click", () => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
})



// Initialize the emoji picker handle emoji selection



// Directly reference messageInput without redeclaring it
if (!messageInput) {
    messageInput = document.querySelector(".message-input");
}

if (!messageInput) {
    console.error("Error: 'message-input' element not found.");
}

// Initialize the emoji picker
const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        // Insert emoji into message input field
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();

        // Close the emoji picker after emoji selection
        document.body.classList.remove("show-emoji-picker");
        console.log("Emoji selected");
    },
    onClickOutside: (e) => {
        const pickerElement = document.querySelector("em-emoji-picker");
        const emojiToggleButton = document.getElementById("emoji-picker");

        // Check if the click is outside the emoji picker AND not on the emoji button
        if (
            !pickerElement.contains(e.target) &&  // Click outside the emoji picker
            e.target !== emojiToggleButton        // Click not on the toggle button
        ) {
            document.body.classList.remove("show-emoji-picker");
            console.log("not selecting");
        }
    }
});

// Toggle emoji picker visibility when clicking the emoji button
const emojiToggleButton = document.getElementById("emoji-picker");
emojiToggleButton.addEventListener("click", (e) => {
    // Prevent the click from bubbling to the onClickOutside handler
    e.stopPropagation();

    // Toggle the visibility of the emoji picker
    document.body.classList.toggle("show-emoji-picker");
    console.log("selecting");
});









document.querySelector(".chat-form").appendChild(picker);

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"))



// fetch('https://restcountries.com/v3.1/all') // Replace with your API URL
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Data received:', data);
//         runEvent(data); // Call the event-handling function
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });

// function runEvent(data) {
//     console.log('Event triggered with data:', data);
//     // Add your event logic here
// }













