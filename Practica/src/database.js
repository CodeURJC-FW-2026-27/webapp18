import { addGame, deleteGame, deleteAllGames, getGames, getGame } from './adminconsole.js';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('Games4LifeDB')
const consoles = db.collection('Consoles');

if ((await consoles.find().toArray()).length === 0) {


let play = {
    _id: new ObjectId('6af38d568722386626454d07'),
    name: 'PlayStation 5',
    brand: 'PlayStation',
    year: 2020,
    price: 499.99,
    rate: 4.8,
    description: 'La PlayStation 5 es la consola de novena generación de Sony que revolucionó el rendimiento en el hogar gracias a su unidad de almacenamiento SSD ultrarrápida, reduciendo drásticamente los tiempos de carga en los videojuegos. Destaca por su soporte para resolución 4K hasta a 120 FPS, tecnología de trazado de rayos (Ray Tracing) y audio 3D inmersivo. Uno de sus mayores atractivos es el mando DualSense, el cual incorpora retroalimentación háptica y gatillos adaptativos que transmiten sensaciones físicas directas a las manos del jugador. Cuenta además con retrocompatibilidad con la inmensa mayoría del catálogo de PS4.',
    imagepreview: 'https://media.game.es/COVERV2/3D_L/206/206665.png',
    imagemain: '/images/PS5.jpg',
}

await consoles.deleteMany({name: play.name});
await deleteAllGames(play._id);
await addConsole(play);

addGame(play._id,{
  name: "Astro Bot",
  price: 59.99,
  ReleaseDate: new Date("2024-09-06"),
  pegi: 3,
  developer: "Team Asobi",
  genre: "Plataformas / Aventura",
  image: "https://www.aceprensa.com/wp-content/uploads/2024/10/image-6.png",
  description: "Un colorido juego de plataformas en el que Astro y su tripulación recorren la galaxia para reconstruir su nave. Aprovecha al máximo el mando DualSense e incluye homenajes a la historia de PlayStation."
});

addGame(play._id,{
  name: "Grand Theft Auto VI",
  price: 79.99,
  ReleaseDate: new Date("2026-11-19"),
  pegi: 18,
  developer: "Rockstar Games",
  genre: "Acción / Mundo abierto",
  image: "https://preview.redd.it/will-gta-vi-cover-art-follow-tradition-or-do-something-new-v0-vsd1bzi5fz3e1.jpg?width=493&format=pjpg&auto=webp&s=e43544cbd7e751aae8bdf4a37e84bb38d3c18322",
  description: "La nueva entrega de la saga de Rockstar nos lleva a Vice City y el estado de Leonida, con una historia protagonizada por Lucia y Jason en un enorme mundo abierto."
});

addGame(play._id,{
  name: "Ratchet & Clank: A New Dimension",
  price: 39.99,
  ReleaseDate: new Date("2021-06-11"),
  pegi: 12,
  developer: "Insomniac Games",
  genre: "Plataformas / Acción",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwnKuXvQ4NfJ-m_hdzCvfIAkRMcfeFaPRQ_p3ZqpAwCw&s=10",
  description: "Ratchet y Clank saltan entre dimensiones para detener al doctor Nefarious. Destaca por sus gráficos de nueva generación, su arsenal de armas y la aparición de Rivet."
});

addGame(play._id,{
  name: "God of War: Ragnarök",
  price: 49.99,
  ReleaseDate: new Date("2022-11-09"),
  pegi: 18,
  developer: "Santa Monica Studio",
  genre: "Acción / Aventura",
  image: "https://m.media-amazon.com/images/I/81jSNKkD9pL.jpg",
  description: "Kratos y Atreus se enfrentan a la llegada del Fimbulwinter y al Ragnarök mientras recorren los nueve reinos de la mitología nórdica en busca de respuestas."
});

addGame(play._id,{
  name: "Ghost of Yōtei",
  price: 79.99,
  ReleaseDate: new Date("2025-10-02"),
  pegi: 18,
  developer: "Sucker Punch Productions",
  genre: "Acción / Aventura / Mundo abierto",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReQcmwWn9ptX2a9yVJ5t258CJ7yyjn6ttlYMWkGt9RYQ&s=10",
  description: "Atsu, una mercenaria en el Japón feudal del siglo XVII, busca venganza contra la banda que mató a su familia en las tierras salvajes de Ezo."
});

addGame(play._id,{
  name: "Marvel's Wolverine",
  price: 79.99,
  ReleaseDate: new Date("2026-09-15"),
  pegi: 18,
  developer: "Insomniac Games",
  genre: "Acción / Aventura",
  image: "https://alldigitales.com/wp-content/uploads/2026/07/wolverine-PS5.webp",
  description: "Logan recorre un mundo brutal y lleno de peligros mientras se enfrenta a enemigos letales, con combate crudo y su factor de curación como seña de identidad."
});

addGame(play._id,{
  name: "Death Stranding 2: On the Beach",
  price: 79.99,
  ReleaseDate: new Date("2025-06-26"),
  pegi: 18,
  developer: "Kojima Productions",
  genre: "Acción / Aventura",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLIKXoz1O-Cowji-eNHbI5QCBkZh4XBWEXHs1g7yClFnk0Zvtizp85VPUU&s=10",
  description: "Sam Porter Bridges vuelve a la misión de reconectar el mundo, con nuevos territorios, aliados y amenazas en una aventura que mezcla acción, sigilo y exploración."
});

addGame(play._id,{
  name: "Marvel's Spider-Man 2",
  price: 49.99,
  ReleaseDate: new Date("2023-10-20"),
  pegi: 16,
  developer: "Insomniac Games",
  genre: "Acción / Aventura / Mundo abierto",
  image: "https://xenogamesec.com/wp-content/uploads/2023/11/Marvels-Spider-Man-2-PS5.webp",
  description: "Peter Parker y Miles Morales se alían contra Kraven y Venom en un Nueva York ampliado, con cambio de personaje al instante y nuevas habilidades como las alas de telaraña."
});
}


export async function addConsole (console) {
    await consoles.insertOne(console);
}

export async function deleteConsole(id) {
    await consoles.deleteOne({_id: new ObjectId(id)});
}

export async function getConsoles() {
    return await consoles.find().toArray();
}

export async function getConsole(id) {
    return await consoles.findOne({_id: new ObjectId(id)});
}