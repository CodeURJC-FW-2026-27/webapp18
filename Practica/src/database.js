const consoles = new Map();
let nextId = 0;

export function addConsole(console) {
    const id = nextId++;
    console.id = id.toString();
    consoles.set(console.id, console);
}

export function deleteConsole(id) {
    consoles.delete(id);
}

export function getConsoles() {
    return [...consoles.values()];
}

export function getConsole(id) {
    return consoles.get(id);
}