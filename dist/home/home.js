import { fetch_messages, send_message_API } from "../utils/API.js";
import { create_message } from "./messages.js";
const pseudo_input = document.getElementById("pseudo");
const msg_area = document.getElementById("message");
const send_button = document.getElementById("send");
const msg_container = document.getElementById("messages_container");
const header = document.getElementById("banner");
let lastScrollY = window.scrollY;
window.addEventListener('scroll', function () {
    const currentScrollY = window.scrollY;
    // Si on scroll vers le bas de plus de 50px
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    }
    else {
        header.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
});
// Optimisation : utiliser requestAnimationFrame pour de meilleures performances
let ticking = false;
function updateHeader() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
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
send_button.addEventListener("click", async (e) => {
    e.preventDefault();
    send_message_API(pseudo_input.value, msg_area.value);
    refresh_messages();
});
refresh_messages();
setInterval(refresh_messages, 5000);
