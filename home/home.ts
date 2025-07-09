import { fetch_messages, get_avatar, MessageData, MessagesData, send_message_API } from "../utils/API.js";
import { load_theme, toggle_theme } from "../utils/theme.js";
import { create_message, insert_message, sync_messages } from "./messages.js";

const msg_area: HTMLTextAreaElement = document.getElementById("message") as HTMLTextAreaElement;

const send_button : HTMLButtonElement = document.getElementById("send") as HTMLButtonElement;
const logout_button : HTMLButtonElement = document.getElementById("logoutButton") as HTMLButtonElement;

export const msg_container : HTMLDivElement = document.getElementById("messages_container") as HTMLDivElement;

const header : HTMLHeadingElement = document.getElementById("banner") as HTMLHeadingElement;
const username_span : HTMLSpanElement = document.getElementById("currentUser") as HTMLSpanElement;
const user_avatar : HTMLImageElement = document.getElementById("currentAvatar") as HTMLImageElement;

const toggle_button : HTMLButtonElement = document.getElementById("themeToggleBtn") as HTMLButtonElement;

export let username : string;

let next_page : number = 2;

// Load
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
async function load_messages(page:number=1):Promise<boolean> {

    const data : MessagesData|null = await fetch_messages(page);

    if(data===null) return false;
    
    const messages : MessageData[] = data.data;

    sync_messages(msg_container,messages);
    
    for(const message of messages){

        if(msg_container.childElementCount===0){
            add_message(message);
        }
        else{
            insert_message(msg_container,message,msg_container,true);
        }
    }

    return messages.length>0;
}

function add_message(data:MessageData):void{
    const new_msg : HTMLDivElement = create_message(data);
    msg_container.appendChild(new_msg);
}
//_________________________________


// Event listeners
send_button.addEventListener("click", async (e:Event) => {
    e.preventDefault();
    if(msg_area.value==="") return;

    const timestamp : string = (new Date()).toISOString();
    const msg_data : MessageData = {
        id : -1,
        username : username,
        content : msg_area.value,
        like : 0,
        created_at : timestamp,
        updated_at : timestamp
    };
    msg_container.appendChild(create_message(msg_data));
    send_message_API(username,msg_area.value);
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

  let isLoading : boolean = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach( async entry => {
      if (next_page>0 && entry.isIntersecting && !isLoading) {
        isLoading = true;
        observer.unobserve(sentinel);
        if( await load_messages(next_page) ){
            
            next_page++;

            setTimeout( () => {
                repositionSentinel(sentinel,observer);
                isLoading = false;
            }, 500);
        }
        else{
            next_page = -1;
        }
      }
    });
  }, {
    rootMargin: '10px'
  });
  
  observer.observe(sentinel);
}

function repositionSentinel(sentinel : HTMLDivElement, observer : IntersectionObserver) {

    requestAnimationFrame( () => {
        msg_container.after(sentinel);
    
        setTimeout(() => {
        observer.observe(sentinel);
        }, 1000);

    })
}


// Initialisation
load_username();
load_theme(toggle_button);


window.addEventListener("DOMContentLoaded", async () => {
    await load_messages();
    setupIntersectionObserver();
});

setInterval(load_messages,15000);

toggle_button.addEventListener("click", () => {
    toggle_theme(toggle_button);
});
