import { send_like } from "../utils/API.js";
export let likes_ids;
export function reset_likes() {
    likes_ids = [];
    save_likes();
}
export function load_likes() {
    const storedIds = localStorage.getItem('likesIds');
    if (!storedIds) {
        return [];
    }
    return JSON.parse(storedIds);
}
export function save_likes() {
    localStorage.setItem('likesIds', JSON.stringify(likes_ids));
}
export async function like_message(id) {
    if (likes_ids.includes(id))
        return;
    likes_ids.push(id);
    save_likes();
    send_like(id);
}
// reset_likes();
likes_ids = load_likes();
