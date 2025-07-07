import { Comment, get_avatar, MessageData } from "../utils/API.js";
import { like_message, likes_ids } from "./likes.js";




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

function format_date(timestamp:string):string{

    const date : Date = new Date(timestamp);
    let formatted_date_time : string;
    
    let hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    
    if(hours<1){
        formatted_date_time = `Il y a ${minutes}`;
    }
    else{

        const formattedTime: string = `${hours}h${pad(String(minutes),2)}`;
        
        const day: number = date.getDate();
        const month: number = date.getMonth() + 1;
        const year: number = date.getFullYear();
        const formattedDate: string = `${pad(String(day),2)}/${pad(String(month),2)}/${year}`;

        formatted_date_time = `${formattedDate} à ${formattedTime}`;
    }

    return formatted_date_time;
}


export function create_message(data:MessageData, comments: Comment[] = []) {
    const msg: HTMLDivElement = document.createElement("div");
    msg.classList.add("message");
    
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
    span_date.classList.add("msg-date");
    name_p.appendChild(span_date);

    msg.appendChild(name_holder);
    
    // Corps du message
    const text_p: HTMLParagraphElement = document.createElement("p");
    text_p.textContent = data.content;
    text_p.classList.add("msg-body");
    msg.appendChild(text_p);
    
    const buttons_holder : HTMLDivElement = document.createElement("div");
    buttons_holder.classList.add("buttons-holder");

    const comments_button : HTMLButtonElement = document.createElement("button");
    comments_button.textContent = "🗨️";
    comments_button.classList.add("comment-button");

    // Bouton like
    const like_button: HTMLButtonElement = document.createElement("button");
    like_button.textContent = (likes_ids.includes(data.id) ? "♥️" : "🤍") + String(data.like);
    like_button.classList.add("like-button");
    
    like_button.addEventListener("click", () => {
        if(likes_ids.includes(data.id)) return;
        const pred_likes : string = (like_button.textContent || "000").slice(2);
        
        like_button.textContent = `♥️`+String(Number(pred_likes)+1);
        like_message(data.id);
    });

    buttons_holder.appendChild(comments_button);
    buttons_holder.appendChild(like_button);
    
    msg.appendChild(buttons_holder);
    
    const comments_container: HTMLDivElement = document.createElement("div");
    comments_container.classList.add("comments-container");
    // Section des commentaires
    if (comments.length > 0) {
        
        comments.forEach(comment => {
            const comment_div: HTMLDivElement = document.createElement("div");
            comment_div.classList.add("comment");
            
            const comment_header: HTMLParagraphElement = document.createElement("p");
            comment_header.textContent = comment.username;
            comment_header.classList.add("comment-name");
            
            const comment_date: HTMLSpanElement = document.createElement("span");
            comment_date.textContent = format_date(comment.created_at);
            comment_date.classList.add("comment-date");
            comment_header.appendChild(comment_date);
            
            const comment_text: HTMLParagraphElement = document.createElement("p");
            comment_text.textContent = comment.content;
            comment_text.classList.add("comment-body");
            
            comment_div.appendChild(comment_header);
            comment_div.appendChild(comment_text);
            comments_container.appendChild(comment_div);
        });
        
    }
    msg.appendChild(comments_container);

    comments_button.addEventListener("click", () => {
        if(comments_container.classList.contains("open")){
            comments_container.classList.remove("open");
            comments_button.classList.remove('open');
        }
        else{
            setTimeout( () => {
                comments_container.classList.add("open");
                comments_button.classList.add('open');
            }, 10 );
        }
    });
    
    return msg;
}