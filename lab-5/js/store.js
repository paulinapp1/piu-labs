
const STORAGE_KEY = 'Store';

class Store {
    constructor(initialState = { shapes: [] }) {
        this.subscribers = new Set();
        this.state = this.loadState(initialState);
    }

    loadState(defaultState) {
        try {
            const serializedState = localStorage.getItem(STORAGE_KEY);
            if (serializedState === null) {
                return defaultState;
            }
            return JSON.parse(serializedState);
        } catch (e) {
            console.error("Błąd wczytywania stanu z localStorage:", e);
            return defaultState;
        }
    }

    saveAndNotify() {
        try {
            const serializedState = JSON.stringify(this.state);
            localStorage.setItem(STORAGE_KEY, serializedState);
        } catch (e) {
            console.error("Błąd zapisywania stanu do localStorage:", e);
        }
        this.notify();
    }

    subscribe(callback) {
        this.subscribers.add(callback);
    }


    notify() {
        this.subscribers.forEach(callback => callback(this.state));
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveAndNotify();
    }

    get squareCount() {
        return this.state.shapes.filter(s => s.type === 'square').length;
    }

    get circleCount() {
        return this.state.shapes.filter(s => s.type === 'circle').length;
    }
}

const store = new Store();

export const addShape = (type, id, color) => {
    const newShape = { id, type, color };
    store.setState({
        shapes: [...store.getState().shapes, newShape],
    });
};

export const removeShape = (id) => {
    store.setState({
        shapes: store.getState().shapes.filter(s => s.id !== id),
    });
};

export const recolorByType = (type, newColorFn) => {
    store.setState({
        shapes: store.getState().shapes.map(shape => {
            if (shape.type === type) {
                return { ...shape, color: newColorFn() };
            }
            return shape;
        }),
    });
};

export default store;