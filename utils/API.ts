import { config } from "./env.js";

export const API_URL = config.API_URL;
const AVATAR_API_URL : string = config.AVATAR_API_URL;

export interface MessageData {
    id : number;
    username : string;
    content : string;
    like : number;
    created_at : string;
    updated_at : string;
}

export interface MessagesData {
    data : MessageData[];
    total: number;
}

export interface Comment {
    id : number;
    message_id : number;
    username : string;
    content : string;
    created_at : string;
    updated_at : string;
}

export interface CommentsData{
    current_page:number;
    data:Comment[];
}

export async function send_message_API(username:string, content:string) {
    
    const res: Response = await fetch(API_URL + "message", {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({

            username: username,
            content: content,

        })

    });
}

export async function fetch_messages(page:number=4):Promise<MessagesData|null>{
    const res : Response = await fetch(API_URL+`messages?page=${page}`);
    
    if(res.ok){
        const data = await res.json();
        return data;
    }
    else{
        console.log("Error : "+res.status);
        return null;
    }
    
}

export async function fetchComments(id:number) : Promise<Comment[]> {
    const res : Response = await fetch(API_URL+`comments?message_id=${id}`);
    if(res.ok){
        const data : CommentsData = await res.json();
        return data.data;
    }
    else{
        console.log("Error : "+res.status);
        return [];
    }
}

export async function send_comment(message_id:number, username:string, content:string) : Promise<void> {
    await fetch(API_URL + "comment", {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({

            message_id: message_id,
            username: username,
            content: content,

        })

    });
}

export function get_avatar(name:string):string{
    return AVATAR_API_URL+name;
}

export async function send_like(id:number) {
    await fetch(API_URL+"message/like", {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({

            message_id: id,

        })

    });
}