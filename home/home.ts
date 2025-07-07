import { fetch_messages, get_avatar, MessageData, MessagesData, send_message_API } from "../utils/API.js";
import { create_message } from "./messages.js";

const msg_area: HTMLTextAreaElement = document.getElementById("message") as HTMLTextAreaElement;

const send_button : HTMLButtonElement = document.getElementById("send") as HTMLButtonElement;
const logout_button : HTMLButtonElement = document.getElementById("logoutButton") as HTMLButtonElement;

const msg_container : HTMLDivElement = document.getElementById("messages_container") as HTMLDivElement;

const header : HTMLHeadingElement = document.getElementById("banner") as HTMLHeadingElement;
const username_span : HTMLSpanElement = document.getElementById("currentUser") as HTMLSpanElement;
const user_avatar : HTMLImageElement = document.getElementById("currentAvatar") as HTMLImageElement;

export let username : string;

// Init
function load_username():void{
    const loaded_value : string|null = localStorage.getItem("username");
    if(loaded_value===null){
        window.location.href = "index.html";
        return;
    }
    else{
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
    } else {
        header.classList.remove('scrolled');
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});
//_________________________________


// Handle messages
async function refresh_messages():Promise<void> {

    const data : MessagesData|null = await fetch_messages();
    
    if(data){
        const messages : MessageData[] = data.data;

        msg_container.innerHTML = "";

        for(const message of messages){
            add_message(message);
        }
    }
}

function add_message(data:MessageData):void{
    const new_msg : HTMLDivElement = create_message(data);
    msg_container.appendChild(new_msg);
}
//_________________________________


// Event listeners
send_button.addEventListener("click", async (e:Event) => {
    e.preventDefault();
    await send_message_API(username,msg_area.value);
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