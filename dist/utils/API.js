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
export async function fetch_messages(page = 4) {
    const res = await fetch(API_URL + `messages?page=${page}`);
    if (res.ok) {
        const data = await res.json();
        return data;
    }
    else {
        console.log("Error : " + res.status);
        return null;
    }
}
export async function fetchComments(id) {
    const res = await fetch(API_URL + `comments?message_id=${id}`);
    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
    else {
        console.log("Error : " + res.status);
        return [];
    }
}
export async function send_comment(message_id, username, content) {
    await fetch(API_URL + "comment", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message_id: message_id,
            username: username,
            content: content,
        })
    });
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
