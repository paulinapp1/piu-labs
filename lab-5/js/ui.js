
import store, { addShape, removeShape, recolorByType } from './store.js';
import { randomHsl, generateUniqueId } from './helpers.js';


const board = document.getElementById('board');
const cntSquaresEl = document.getElementById('cntSquares');
const cntCirclesEl = document.getElementById('cntCircles');
const controls = document.querySelector('.controls');


function createShapeElement(shape) {
    const el = document.createElement('div');
    el.className = `shape ${shape.type}`;
    el.style.backgroundColor = shape.color;
    el.dataset.id = shape.id;
    return el;
}

function updateCounters() {
    cntSquaresEl.textContent = store.squareCount;
    cntCirclesEl.textContent = store.circleCount;
}

let lastShapeIds = new Set();

function handleStoreChange(state) {
    updateCounters();

    const currentShapes = state.shapes;
    const currentShapeIds = new Set(currentShapes.map(s => s.id));
    

    lastShapeIds.forEach(id => {
        if (!currentShapeIds.has(id)) {
            const elToRemove = document.querySelector(`.shape[data-id="${id}"]`);
            if (elToRemove) {
                elToRemove.remove();
            }
        }
    });

 
    let lastElement = null;

    currentShapes.forEach(shape => {
        let el = document.querySelector(`.shape[data-id="${shape.id}"]`);

        if (!el) {
            el = createShapeElement(shape);
            if (lastElement && lastElement.nextElementSibling) {
                board.insertBefore(el, lastElement.nextElementSibling);
            } else {
                board.appendChild(el);
            }
        } else {
            if (el.style.backgroundColor !== shape.color) {
                el.style.backgroundColor = shape.color;
            }
        }
        
        lastElement = el;
    });

    lastShapeIds = currentShapeIds;
}


board.addEventListener('click', (e) => {
    const targetShape = e.target.closest('.shape');
    if (targetShape) {
        const id = targetShape.dataset.id;
        if (id) {
            removeShape(id); 
        }
    }
});

controls.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    
    if (!action) return;

    switch (action) {
        case 'addSquare':
            addShape('square', generateUniqueId(), randomHsl());
            break;
        case 'addCircle':
            addShape('circle', generateUniqueId(), randomHsl());
            break;
        case 'recolorSquares':
            recolorByType('square', randomHsl);
            break;
        case 'recolorCircles':
            recolorByType('circle', randomHsl);
            break;
    }
});

export function initUI() {
    store.subscribe(handleStoreChange);
    const initialState = store.getState();
    handleStoreChange(initialState); 
}