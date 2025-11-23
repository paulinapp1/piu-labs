import { initUI } from './ui.js';
import store from './store.js'; 

initUI();

console.log("Aplikacja Kształty uruchomiona.");
console.log("Stan początkowy wczytany ze store:", store.getState());