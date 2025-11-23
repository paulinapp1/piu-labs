
export function randomHsl() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.floor(Math.random() * 20); 
    const lightness = 65 + Math.floor(Math.random() * 10); 
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

let idCounter = 0;
export function generateUniqueId() {
    return `shape-${idCounter++}-${Date.now()}`;
}