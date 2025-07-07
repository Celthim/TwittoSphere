import { config } from "./env.js";
export const API_URL = config.API_URL;
const AVATAR_API_URL = config.AVATAR_API_URL;
export async function send_message_API(username, content) {
    const res = await fetch(API_URL + "message", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            content: content,
        })
    });
}
export async function fetch_messages() {
    const res = await fetch(API_URL + "messages");
    if (res.ok) {
        const data = await res.json();
        return data;
    }
    else {
        console.log("Error : " + res.status);
        return null;
    }
}
export async function fetchComments(message) {
    const res = await fetch(API_URL + "comments?message_id)" + message.id);
    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
    else {
        console.log("Error : " + res.status);
        return [];
    }
}
export function get_avatar(name) {
    return AVATAR_API_URL + name;
}
export async function send_like(id) {
    await fetch(API_URL + "message/like", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message_id: id,
        })
    });
}
