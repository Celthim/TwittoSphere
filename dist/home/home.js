import { fetch_messages, get_avatar, send_message_API } from "../utils/API.js";
import { load_theme, toggle_theme } from "../utils/theme.js";
import { create_message, insert_message, sync_messages } from "./messages.js";
const msg_area = document.getElementById("message");
const send_button = document.getElementById("send");
const logout_button = document.getElementById("logoutButton");
export const msg_container = document.getElementById("messages_container");
const header = document.getElementById("banner");
const username_span = document.getElementById("currentUser");
const user_avatar = document.getElementById("currentAvatar");
const toggle_button = document.getElementById("themeToggleBtn");
export let username;
let next_page = 2;
// Load
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
async function load_messages(page = 1) {
    const data = await fetch_messages(page);
    if (data === null)
        return false;
    const messages = data.data;
    sync_messages(msg_container, messages);
    for (const message of messages) {
        if (msg_container.childElementCount === 0) {
            add_message(message);
        }
        else {
            insert_message(msg_container, message, msg_container, true);
        }
    }
    return messages.length > 0;
}
function add_message(data) {
    const new_msg = create_message(data);
    msg_container.appendChild(new_msg);
}
//_________________________________
// Event listeners
send_button.addEventListener("click", async (e) => {
    e.preventDefault();
    if (msg_area.value === "")
        return;
    const timestamp = (new Date()).toISOString();
    const msg_data = {
        id: -1,
        username: username,
        content: msg_area.value,
        like: 0,
        created_at: timestamp,
        updated_at: timestamp
    };
    msg_container.appendChild(create_message(msg_data));
    send_message_API(username, msg_area.value);
    msg_area.value = "";
});
logout_button.addEventListener("click", () => {
    localStorage.removeItem("username");
    window.location.href = "index.html";
});
//_________________________________
function setupIntersectionObserver() {
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.bottom = '0';
    msg_container.after(sentinel);
    let isLoading = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
            if (next_page > 0 && entry.isIntersecting && !isLoading) {
                isLoading = true;
                observer.unobserve(sentinel);
                if (await load_messages(next_page)) {
                    next_page++;
                    setTimeout(() => {
                        repositionSentinel(sentinel, observer);
                        isLoading = false;
                    }, 500);
                }
                else {
                    next_page = -1;
                }
            }
        });
    }, {
        rootMargin: '10px'
    });
    observer.observe(sentinel);
}
function repositionSentinel(sentinel, observer) {
    requestAnimationFrame(() => {
        msg_container.after(sentinel);
        setTimeout(() => {
            observer.observe(sentinel);
        }, 1000);
    });
}
// Initialisation
load_username();
load_theme(toggle_button);
window.addEventListener("DOMContentLoaded", async () => {
    await load_messages();
    setupIntersectionObserver();
});
setInterval(load_messages, 15000);
toggle_button.addEventListener("click", () => {
    toggle_theme(toggle_button);
});
