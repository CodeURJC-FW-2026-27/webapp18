const console = {
    id: null,
    name: "",
    brand: "",
    year: 0,
    price: 0,
    rate: 0,
    description: "",
    games: new Map(),
}
nextId = 0;

export function addGame(game) {
    const id = nextId++;
    game.id = id.toString();
    console.games.set(game.id, game);
}

export function deleteGame(id) {
    console.games.delete(id);
}

export function getGames() {
    return [...console.games.values()];
}

export function getGame(id) {
    return console.games.get(id);
}   
