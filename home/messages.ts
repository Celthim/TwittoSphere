import { Comment, fetchComments, get_avatar, MessageData, send_comment } from "../utils/API.js";
import { username } from "./home.js";
import { like_message, likes_ids } from "./likes.js";


let dates : HTMLSpanElement[] = [];

function pad(word:string,pad_size:number):string{
    if(word.length>pad_size){
        return word;
    }
    else{
        let res : string = "";
        for (let i = 0; i < pad_size-word.length; i++) {
            res+="0";
        }
        res+=word;
        return res;
    }
}

function format_date(timestamp: string): string {
    const date: Date = new Date(timestamp);
    const now: Date = new Date();
    
    const diffMs: number = now.getTime() - date.getTime();
    const diffMinutes: number = Math.floor(diffMs / (1000 * 60));
    const diffHours: number = Math.floor(diffMs / (1000 * 60 * 60));
    
    let formatted_date_time: string;
    
    if (diffHours < 1) {
        if (diffMinutes < 1) {
            formatted_date_time = "À l'instant";
        } else {
            formatted_date_time = `Il y a ${diffMinutes} min`;
        }
    } else if (diffHours < 24) {
        formatted_date_time = `Il y a ${diffHours}h`;
    } else {
        const hours: number = date.getHours();
        const minutes: number = date.getMinutes();
        const formattedTime: string = `${hours}h${pad(String(minutes), 2)}`;
        
        const day: number = date.getDate();
        const month: number = date.getMonth() + 1;
        const year: number = date.getFullYear();
        const formattedDate: string = `${pad(String(day), 2)}/${pad(String(month), 2)}/${year}`;
        
        formatted_date_time = `${formattedDate} à ${formattedTime}`;
    }
    
    return formatted_date_time;
}


export function create_message(data:MessageData|Comment, is_comment : boolean = false) {
    const msg: HTMLDivElement = document.createElement("div");
    msg.classList.add(is_comment ? "comment" : "message");
    msg.setAttribute("data-msg-id",String(data.id));
    
    // En-tête du message avec nom et date

    const name_holder : HTMLDivElement = document.createElement("div");
    name_holder.classList.add("name-holder");

    const avatar : HTMLImageElement = document.createElement("img");
    avatar.src = get_avatar(data.username);
    avatar.classList.add('msg-avatar');

    const name_p: HTMLParagraphElement = document.createElement("p");
    name_p.textContent = data.username;
    name_p.classList.add("msg-name");

    name_holder.appendChild(avatar);
    name_holder.appendChild(name_p);
    
    const span_date: HTMLSpanElement = document.createElement("span");
    span_date.textContent = format_date(data.created_at);
    span_date.setAttribute("data-timestamp",data.created_at);
    dates.push(span_date);
    span_date.classList.add("msg-date");
    name_p.appendChild(span_date);

    msg.appendChild(name_holder);
    
    // Corps du message
    const text_p: HTMLParagraphElement = document.createElement("p");
    text_p.textContent = data.content;
    text_p.classList.add("msg-body");
    msg.appendChild(text_p);

    if(is_comment) return msg;
    
    const buttons_holder : HTMLDivElement = document.createElement("div");
    buttons_holder.classList.add("buttons-holder");

    const comments_button : HTMLButtonElement = document.createElement("button");
    comments_button.textContent = "🗨️";
    comments_button.classList.add("comment-button");

    // Bouton like
    const like_button: HTMLButtonElement = document.createElement("button");
    like_button.textContent = (likes_ids.includes(data.id) ? "💜" : "🤍") + String((data as MessageData).like);
    like_button.classList.add("like-button");
    
    like_button.addEventListener("click", () => {
        if(likes_ids.includes(data.id)) return;
        const pred_likes : string = (like_button.textContent || "000").slice(2);
        
        like_button.textContent = `💜`+String(Number(pred_likes)+1);
        like_message(data.id);
    });

    buttons_holder.appendChild(comments_button);
    buttons_holder.appendChild(like_button);
    
    msg.appendChild(buttons_holder);
    
    const comments_container: HTMLDivElement = document.createElement("div");
    comments_container.classList.add("comments-container");
    
    msg.appendChild(comments_container);

    comments_button.addEventListener("click", async () => {
        if(comments_container.classList.contains("open")){
            comments_container.classList.remove("open");
            comments_button.classList.remove('open');
        }
        else{
            await compute_comments(msg);
            setTimeout( () => {
                comments_container.classList.add("open");
                comments_button.classList.add('open');
            }, 10 );
        }
    });
    
    return msg;
}


async function compute_comments(message:HTMLDivElement):Promise<void>{

    const did_load : string|null = message.getAttribute("data-did-load");
    if(did_load !== null) return;

    message.setAttribute("data-did-load","1");
    const msg_id : number = Number(message.getAttribute("data-msg-id"));
    const comments_container : HTMLDivElement = message.querySelector(".comments-container") as HTMLDivElement;

    const comments : Comment[] = await fetchComments(msg_id);

    for(const comment of comments){
        comments_container.prepend(create_message(comment,true));
    }

    const send_comment_holder : HTMLDivElement = document.createElement("div");
    send_comment_holder.classList.add("comment-form");

    const send_comment_input : HTMLInputElement = document.createElement("input");
    send_comment_input.type = 'text';
    send_comment_input.className = 'comment-input';
    send_comment_input.placeholder = 'Écrivez votre commentaire...';

    const send_comment_button : HTMLButtonElement = document.createElement("button");
    send_comment_button.classList.add("action-button");
    send_comment_button.textContent = 'Envoyer';

    send_comment_holder.appendChild(send_comment_input);
    send_comment_holder.appendChild(send_comment_button);

    comments_container.appendChild(send_comment_holder);

    send_comment_button.addEventListener("click", async () => {
        const content : string = send_comment_input.value;
        if(content==="") return;
        send_comment(msg_id,username,content);
        const timestamp : string = (new Date()).toISOString();
        send_comment_holder.before(create_message({message_id:msg_id,username:username,content:content,created_at:timestamp,updated_at:timestamp} as Comment,true));
        send_comment_input.value = "";
    });
}


function refresh_dates():void{
    for(const span_date of dates){
        span_date.textContent = format_date(span_date.getAttribute("data-timestamp")||"");
    }
}

setInterval(refresh_dates,1000);