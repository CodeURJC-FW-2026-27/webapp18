import { addGame, deleteGame, getGames, getGame } from './adminconsole.js';
const consoles = new Map();
let nextId = 0;

addConsole({
    name: 'PlayStation 5',
    brand: 'PlayStation',
    year: 2020,
    price: 499.99,
    rate: 4.8,
    description: 'La PlayStation 5 es la consola de novena generación de Sony que revolucionó el rendimiento en el hogar gracias a su unidad de almacenamiento SSD ultrarrápida, reduciendo drásticamente los tiempos de carga en los videojuegos. Destaca por su soporte para resolución 4K hasta a 120 FPS, tecnología de trazado de rayos (Ray Tracing) y audio 3D inmersivo. Uno de sus mayores atractivos es el mando DualSense, el cual incorpora retroalimentación háptica y gatillos adaptativos que transmiten sensaciones físicas directas a las manos del jugador. Cuenta además con retrocompatibilidad con la inmensa mayoría del catálogo de PS4.',
    imagepreview: 'https://media.game.es/COVERV2/3D_L/206/206665.png',
    imagemain: '/images/PS5.jpg',
});


let play = getConsole('0');

addGame(play,{
  nombre: "Astro Bot",
  precio: 59.99,
  fechaSalida: new Date("2024-09-06"),
  pegi: 3,
  desarrollador: "Team Asobi",
  genero: "Plataformas / Aventura",
  imagen: "https://www.aceprensa.com/wp-content/uploads/2024/10/image-6.png",
  descripcion: "Un colorido juego de plataformas en el que Astro y su tripulación recorren la galaxia para reconstruir su nave. Aprovecha al máximo el mando DualSense e incluye homenajes a la historia de PlayStation."
});

addGame(play,{
  nombre: "Grand Theft Auto VI",
  precio: 79.99,
  fechaSalida: new Date("2026-11-19"),
  pegi: 18,
  desarrollador: "Rockstar Games",
  genero: "Acción / Mundo abierto",
  imagen: "https://preview.redd.it/will-gta-vi-cover-art-follow-tradition-or-do-something-new-v0-vsd1bzi5fz3e1.jpg?width=493&format=pjpg&auto=webp&s=e43544cbd7e751aae8bdf4a37e84bb38d3c18322",
  descripcion: "La nueva entrega de la saga de Rockstar nos lleva a Vice City y el estado de Leonida, con una historia protagonizada por Lucia y Jason en un enorme mundo abierto."
});

addGame(play,{
  nombre: "Ratchet & Clank: A New Dimension",
  precio: 39.99,
  fechaSalida: new Date("2021-06-11"),
  pegi: 12,
  desarrollador: "Insomniac Games",
  genero: "Plataformas / Acción",
  imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwnKuXvQ4NfJ-m_hdzCvfIAkRMcfeFaPRQ_p3ZqpAwCw&s=10",
  descripcion: "Ratchet y Clank saltan entre dimensiones para detener al doctor Nefarious. Destaca por sus gráficos de nueva generación, su arsenal de armas y la aparición de Rivet."
});

addGame(play,{
  nombre: "God of War: Ragnarök",
  precio: 49.99,
  fechaSalida: new Date("2022-11-09"),
  pegi: 18,
  desarrollador: "Santa Monica Studio",
  genero: "Acción / Aventura",
  imagen: "https://m.media-amazon.com/images/I/81jSNKkD9pL.jpg",
  descripcion: "Kratos y Atreus se enfrentan a la llegada del Fimbulwinter y al Ragnarök mientras recorren los nueve reinos de la mitología nórdica en busca de respuestas."
});

addGame(play,{
  nombre: "Ghost of Yōtei",
  precio: 79.99,
  fechaSalida: new Date("2025-10-02"),
  pegi: 18,
  desarrollador: "Sucker Punch Productions",
  genero: "Acción / Aventura / Mundo abierto",
  imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReQcmwWn9ptX2a9yVJ5t258CJ7yyjn6ttlYMWkGt9RYQ&s=10",
  descripcion: "Atsu, una mercenaria en el Japón feudal del siglo XVII, busca venganza contra la banda que mató a su familia en las tierras salvajes de Ezo."
});

addGame(play,{
  nombre: "Marvel's Wolverine",
  precio: 79.99,
  fechaSalida: new Date("2026-09-15"),
  pegi: 18,
  desarrollador: "Insomniac Games",
  genero: "Acción / Aventura",
  imagen: "https://alldigitales.com/wp-content/uploads/2026/07/wolverine-PS5.webp",
  descripcion: "Logan recorre un mundo brutal y lleno de peligros mientras se enfrenta a enemigos letales, con combate crudo y su factor de curación como seña de identidad."
});

addGame(play,{
  nombre: "Death Stranding 2: On the Beach",
  precio: 79.99,
  fechaSalida: new Date("2025-06-26"),
  pegi: 18,
  desarrollador: "Kojima Productions",
  genero: "Acción / Aventura",
  imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLIKXoz1O-Cowji-eNHbI5QCBkZh4XBWEXHs1g7yClFnk0Zvtizp85VPUU&s=10",
  descripcion: "Sam Porter Bridges vuelve a la misión de reconectar el mundo, con nuevos territorios, aliados y amenazas en una aventura que mezcla acción, sigilo y exploración."
});

addGame(play,{
  nombre: "Marvel's Spider-Man 2",
  precio: 49.99,
  fechaSalida: new Date("2023-10-20"),
  pegi: 16,
  desarrollador: "Insomniac Games",
  genero: "Acción / Aventura / Mundo abierto",
  imagen: "https://xenogamesec.com/wp-content/uploads/2023/11/Marvels-Spider-Man-2-PS5.webp",
  descripcion: "Peter Parker y Miles Morales se alían contra Kraven y Venom en un Nueva York ampliado, con cambio de personaje al instante y nuevas habilidades como las alas de telaraña."
});




export function addConsole(console) {
    const id = nextId++;
    console.id = id.toString();
    consoles.set(console.id, console);
    console.nextGameId = 0;
    console.games = new Map();
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