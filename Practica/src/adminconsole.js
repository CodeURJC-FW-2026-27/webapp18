export function addGame(console,game) {
    const id = console.cnextId++;
    game.id = id.toString();
    console.games.set(game.id, game);
}

export function deleteGame(console,id) {
    console.games.delete(id);
}

export function getGames() {
    return [...console.games.values()];
}

export function getGame(console,id) {
    return console.games.get(id);
}   
