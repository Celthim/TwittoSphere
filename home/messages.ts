import { Comment, fetchComments, get_avatar, MessageData, send_comment } from "../utils/API.js";
import { username } from "./home.js";
import { like_message, likes_ids } from "./likes.js";

let dates : HTMLSpanElement[] = [];

let curr_comments_msg : HTMLDivElement|null = null;

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

    comments_button.addEventListener("click", async () => {
        if(comments_container.classList.contains("open")){
            collapse_comments(msg,comments_container,comments_button);
        }
        else{
            expand_comments(msg,comments_container,comments_button);
        }
    });
    
    //Section commentaires
    const comments_container: HTMLDivElement = document.createElement("div");
    comments_container.classList.add("comments-container");


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
        const content : string = send_comment_input.value.trim();
        if(content==="") return;
        send_comment(data.id,username,content);

        const timestamp : string = (new Date()).toISOString();
        const comment_data : Comment = {
            id : -1,
            message_id:data.id,
            username:username,
            content:content,
            created_at:timestamp,
            updated_at:timestamp
        };
        send_comment_holder.before(create_message(comment_data,true));
        send_comment_input.value = "";
    });
    
    msg.appendChild(comments_container);
    
    return msg;
}

async function expand_comments(message:HTMLDivElement,container?:HTMLDivElement,button?:HTMLButtonElement) {
    if(container===undefined) container = message.querySelector(".comments-container") as HTMLDivElement;
    if(container.classList.contains("open")) return;

    if(button===undefined) button = message.querySelector(".comment-button") as HTMLButtonElement;

    const did_load : string|null = message.getAttribute("data-did-load");
    let do_scroll : boolean = false;
    if(did_load===null){
        do_scroll = await compute_comments(message);
        message.setAttribute("data-did-load","1");
    }
    else{
        compute_comments(message);
    }
    
    if(curr_comments_msg!=null){
        collapse_comments(curr_comments_msg);
    }
    curr_comments_msg = message;
    
    setTimeout( () => {
        container?.classList.add("open");
        button?.classList.add('open');
        if(do_scroll) window.scrollBy(0,-container.clientHeight);
    }, 10 );
}

function collapse_comments(message:HTMLDivElement,container?:HTMLDivElement,button?:HTMLButtonElement):void {
    if(container===undefined) container = message.querySelector(".comments-container") as HTMLDivElement;
    if(!container.classList.contains("open")) return;

    if(button===undefined) button = message.querySelector(".comment-button") as HTMLButtonElement;

    curr_comments_msg = null;

    container?.classList.remove("open");
    button?.classList.remove('open');
}

async function compute_comments(message:HTMLDivElement):Promise<boolean>{
    
    const msg_id : number = Number(message.getAttribute("data-msg-id"));
    const comments_container : HTMLDivElement = message.querySelector(".comments-container") as HTMLDivElement;
    const send_comment_holder : HTMLDivElement = message.querySelector(".comment-form") as HTMLDivElement;
    
    const comments : Comment[] = await fetchComments(msg_id);

    sync_messages(comments_container,comments);
    
    for(let i = 0; i<comments.length; i++){
        const reverse_i : number = comments.length - 1 - i;
        const comment : Comment = comments[reverse_i];
        insert_comment(comments_container,comment,send_comment_holder);
    }

    return comments.length>0;
    
}

function insert_comment(container:HTMLDivElement,data:Comment,next_sibling:Element){
    insert_message(container,data,next_sibling,false,true);
}

export function insert_message(container:HTMLDivElement,data:MessageData|Comment,
                                next_sibling:Element,append=true,is_comment=false):void{
    
    let is_present : boolean = false;
    const base_sibling = next_sibling;
    
    for(const child of container.children){
    
        const comment_id : string|null = child.getAttribute("data-msg-id");
        if(comment_id===null) continue;
    
        if(Number(comment_id)>data.id){
            next_sibling = child;
            break;
        }
        else if(Number(comment_id)===data.id){
            is_present = true;
            break;
        }
    
    }
    
    if(!is_present){
        if(append && next_sibling==base_sibling){
            next_sibling.appendChild(create_message(data,is_comment));
        }
        else{
            next_sibling.before(create_message(data,is_comment));
        }
    } 

}

// Messages&Comments being generated on client's side when sent, we need to sync them up with the right ID when we refresh them. That way we can reorganized them temporaly and make sure we don't show the same again.
export function sync_messages(container:HTMLDivElement,fetched_data:MessageData[]|Comment[]):void{

    for(const child of container.children){

        const local_id : string|null = child.getAttribute("data-msg-id");
        
        // On check si l'on trouve un ID à -1, qui sont ceux générés localements qui nécessitent d'être sync
        if(local_id===null || local_id!=="-1") continue;

        const date_span : HTMLSpanElement|null = child.querySelector(".msg-date");
        
        if(date_span===null) continue;

        // On récupère le timestamp sur l'élément HTML directement (généré localement pour les msg&coms envoyés)
        const timestamp : string|null = date_span.getAttribute("data-timestamp"); 
        
        if(timestamp===null) continue;
        
        //On compare avec les timestamps récupéré depuis le serveur, avec une fenêtre d'1 minute pour prendre en compte le délai qui a pu se produire entre la génération en local et son envoie sur le serveur
        for(const comment of fetched_data){
            const localMs : number = new Date(timestamp).getTime();
            const remoteMs : number = new Date(comment.created_at).getTime();
            
            // Si l'on trouve une data distante avec 1mn max de décalage avec le local, on compare les corps de message et si on match on resync en attribuant le bon ID et le bon timestamp
            if(Math.abs(localMs-remoteMs)<60000.0){
                const msg_body : HTMLParagraphElement|null = child.querySelector(".msg-body");

                if(msg_body===null) continue;

                const msg : string|null = msg_body.textContent;
                

                if(msg!==null && msg==comment.content){
                    child.setAttribute("data-msg-id",String(comment.id));
                    date_span.setAttribute("data-timestamp",comment.created_at);
                }
            }
        }
    }

}

function refresh_comments():void{
    if(curr_comments_msg!==null){
        compute_comments(curr_comments_msg);
    }
}

function refresh_dates():void{
    for(const span_date of dates){
        span_date.textContent = format_date(span_date.getAttribute("data-timestamp")||"");
    }
}

setInterval(refresh_dates,1000);
setInterval(refresh_comments,10000);