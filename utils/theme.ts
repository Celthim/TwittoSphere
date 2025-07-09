
export function get_current_theme():string{
    const curr_theme : string|null = document.documentElement.getAttribute("data-theme");

    if(curr_theme===null) return "light";

    return curr_theme;
}

export function save_theme():void{
    localStorage.setItem("theme",get_current_theme());
}

export function load_theme(toggle_button?:HTMLButtonElement):void{
    const saved_theme : string|null = localStorage.getItem("theme");
    if(saved_theme === null) return;

    set_theme(saved_theme);

    if(toggle_button){
        refresh_toggle_button(toggle_button,saved_theme);
    }
}

export function set_theme(theme:string):void{
    document.documentElement.setAttribute("data-theme",theme);
}

export function refresh_toggle_button(toggle_button:HTMLButtonElement,theme:string):void{
    toggle_button.textContent = theme==="light" ? "🔆":"🌙";
}

export function toggle_theme(toggle_button : HTMLButtonElement):void{
    const new_theme : string = get_current_theme()==="light" ? "dark":"light";
    set_theme(new_theme);
    save_theme();
    refresh_toggle_button(toggle_button,new_theme);
}