import { fetch_messages, get_avatar, send_message_API } from "../utils/API.js";
import { create_message } from "./messages.js";
const msg_area = document.getElementById("message");
const send_button = document.getElementById("send");
const logout_button = document.getElementById("logoutButton");
const msg_container = document.getElementById("messages_container");
const header = document.getElementById("banner");
const username_span = document.getElementById("currentUser");
const user_avatar = document.getElementById("currentAvatar");
export let username;
// Init
function load_username() {
    const loaded_value = localStorage.getItem("username");
    if (loaded_value === null) {
        window.location.href = "index.html";
        return;
    }
    else {
        username = loaded_value;
        username_span.textContent = username;
        user_avatar.src = get_avatar(username);
    }
}
//_________________________________
// Animation Header onScroll
let ticking = false;
function updateHeader() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
    else {
        header.classList.remove('scrolled');
    }
    ticking = false;
}
window.addEventListener('scroll', function () {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});
//_________________________________
// Handle messages
async function refresh_messages() {
    const data = await fetch_messages();
    if (data) {
        const messages = data.data;
        msg_container.innerHTML = "";
        for (const message of messages) {
            add_message(message);
        }
    }
}
function add_message(data) {
    const new_msg = create_message(data);
    msg_container.appendChild(new_msg);
}
//_________________________________
// Event listeners
send_button.addEventListener("click", async (e) => {
    e.preventDefault();
    await send_message_API(username, msg_area.value);
    refresh_messages();
});
logout_button.addEventListener("click", () => {
    localStorage.removeItem("username");
    window.location.href = "index.html";
});
//_________________________________
load_username();
refresh_messages();
// setInterval(refresh_messages,5000);
