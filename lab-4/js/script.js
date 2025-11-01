function getRandomColor() {
    const CARD_COLORS = ['#ffffffff', '#D4E7FD', '#D4FDCB'];
    const randomIndex = Math.floor(Math.random() * CARD_COLORS.length);
    return CARD_COLORS[randomIndex];
}
let nextCardId = 1;
/** @param {string} id */
/** @param {string} content */
/** @param {string} color */
/** @param {string} columnId */

function updateCardCount(columnId) {
    const column = document.getElementById(columnId);
    const count = column.querySelectorAll('.card').length;
    column.querySelector('.card-count').textContent = `Liczba Kart: ${count}`;
}

document.querySelectorAll('.column').forEach((column) => {
    updateCardCount(column.id);
});
const storage_key = 'kanban-board-state';
function saveBoardState() {
    const state = {
        nextCardId: nextCardId,
        columns: {},
    };
    document.querySelectorAll('.column').forEach((column) => {
        const columnId = column.id;
        const cards = [];
        column.querySelectorAll('.card').forEach((card) => {
            cards.push({
                id: card.dataset.cardId,
                content: card.querySelector('.card-content').textContent,
                color: card.style.backgroundColor,
            });
        });
        state.columns[columnId] = cards;
    });
    localStorage.setItem(storage_key, JSON.stringify(state));
}
function loadBoardState() {
    const storedState = localStorage.getItem(storage_key);
    if (!storedState) return;

    const state = JSON.parse(storedState);
    nextCardId = state.nextCardId || 1;

    document
        .querySelectorAll('.cards-container')
        .forEach((container) => (container.innerHTML = ''));
    for (const [columnId, cards] of Object.entries(state.columns)) {
        const cardsContainer = document.querySelector(
            `#${columnId} .cards-container`
        );
        if (cardsContainer) {
            cards.reverse().forEach((cardData) => {
                const cardElement = createCard(
                    cardData.id,
                    cardData.content,
                    cardData.color,
                    columnId
                );
                cardsContainer.appendChild(cardElement);
            });
            updateCardCount(columnId);
        }
    }
}
loadBoardState();
function createCard(id, content, color, columnId) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${id}`;
    card.dataset.cardId = id;
    card.dataset.originalColor = color;
    card.style.backgroundColor = color;

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    cardContent.contentEditable = true;
    cardContent.textContent = content;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-card-button';
    deleteButton.innerHTML = '&times;';
    deleteButton.setAttribute('aria-label', 'Delete card');

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.innerHTML = `
        <button class="move-left-button" data-direction="left" aria-label="Przenieś w lewo">←</button>
        <button class="colorize-single-button" aria-label="Zmień kolor karty">🎨</button>
        <button class="move-right-button" data-direction="right" aria-label="Przenieś w prawo">→</button>
    `;

    card.appendChild(deleteButton);
    card.appendChild(cardContent);
    card.appendChild(actions);

    return card;
}
function moveCard(card, currentColumnId, direction) {
    let targetColumnId;
    if (currentColumnId === 'todo-column' && direction === 'right') {
        targetColumnId = 'in-progress-column';
    } else if (currentColumnId === 'in-progress-column') {
        targetColumnId = direction === 'right' ? 'done-column' : 'todo-column';
    } else if (currentColumnId === 'done-column' && direction === 'left') {
        targetColumnId = 'in-progress-column';
    }
    if (targetColumnId) {
        const targetContainer = document.querySelector(
            `#${targetColumnId} .cards-container`
        );
        if (targetContainer) {
            targetContainer.prepend(card);
            updateCardCount(currentColumnId);
            updateCardCount(targetColumnId);
            saveBoardState();
        }
    }
}

document.querySelectorAll('.add-card-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const column = e.target.closest('.column');
        const cardsContainer = column.querySelector('.cards-container');
        const newCardId = nextCardId++;
        const newCard = createCard(
            newCardId,
            'Nowa karta',
            getRandomColor(),
            column.id
        );
        cardsContainer.prepend(newCard);
        updateCardCount(column.id);
        saveBoardState();
    });
});
document.querySelectorAll('.column').forEach((column) => {
    column.addEventListener('click', (e) => {
        const target = e.target;
        const card = target.closest('.card');

        if (!card) return;

        if (target.classList.contains('delete-card-button')) {
            card.remove();
            updateCardCount(column.id);
            saveBoardState();
        } else if (
            target.classList.contains('move-left-button') ||
            target.classList.contains('move-right-button')
        ) {
            moveCard(card, column.id, target.dataset.direction);
            saveBoardState();
        } else if (target.classList.contains('colorize-single-button')) {
            const originalColor = card.dataset.originalColor;
            let newColor;
            do {
                newColor = getRandomColor();
            } while (newColor === originalColor);
            card.style.backgroundColor = newColor;
            card.dataset.originalColor = newColor;
            saveBoardState();
        }
    });

    column.addEventListener('input', (e) => {
        if (e.target.classList.contains('card-content')) {
            saveBoardState();
        }
    });
});

document.querySelectorAll('.colorize-column-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const column = e.target.closest('.column');
        const cards = column.querySelectorAll('.card');
        const newColor = getRandomColor();

        cards.forEach((card) => {
            card.style.backgroundColor = newColor;
        });

        saveBoardState();
    });
});

document.querySelectorAll('.sort-column-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const column = e.target.closest('.column');
        const cardsContainer = column.querySelector('.cards-container');
        const cardsArray = Array.from(cardsContainer.querySelectorAll('.card'));

        cardsArray.sort((a, b) => {
            const contentA = a
                .querySelector('.card-content')
                .textContent.toLowerCase();
            const contentB = b
                .querySelector('.card-content')
                .textContent.toLowerCase();
            if (contentA < contentB) return -1;
            if (contentA > contentB) return 1;
            return 0;
        });

        cardsArray.forEach((card) => cardsContainer.appendChild(card));

        saveBoardState();
    });
});
