import { fetch_messages, MessageData, MessagesData, send_message_API } from "../utils/API.js";
import { create_message } from "./messages.js";


const pseudo_input: HTMLInputElement = document.getElementById("pseudo") as HTMLInputElement;
const msg_area: HTMLTextAreaElement = document.getElementById("message") as HTMLTextAreaElement;

const send_button : HTMLButtonElement = document.getElementById("send") as HTMLButtonElement;

const msg_container : HTMLDivElement = document.getElementById("messages_container") as HTMLDivElement;

const header : HTMLHeadingElement = document.getElementById("banner") as HTMLHeadingElement;
let lastScrollY = window.scrollY;

window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    
    // Si on scroll vers le bas de plus de 50px
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
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


send_button.addEventListener("click", async (e:Event) => {
    e.preventDefault();
    send_message_API(pseudo_input.value,msg_area.value);
    refresh_messages();
})

refresh_messages();
setInterval(refresh_messages,5000);