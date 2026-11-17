import { addGame, deleteGame, deleteAllGames, getGames, getGame } from './adminconsole.js';
import { MongoClient, ObjectId } from 'mongodb';
import { readFile } from 'node:fs/promises';


const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('Games4LifeDB')
const consoles = db.collection('Consoles');


async function loadSampleData() {
    const sampleData = JSON.parse(await readFile(new URL('../data/data.json', import.meta.url), 'utf8'));
    for (const { games = [], ...consoleFields } of sampleData.consoles) {
        const { insertedId } = await consoles.insertOne(consoleFields);
        for (const game of games) {
            await addGame(insertedId, { ...game, ReleaseDate: new Date(game.ReleaseDate) });
        }
    }
}

if (await consoles.countDocuments() === 0) {
    await loadSampleData();
}


export async function addConsole(console) {
  await consoles.insertOne(console);
}

export async function deleteConsole(id) {
  await consoles.deleteOne({ _id: new ObjectId(id) });
}

export async function getConsoles() {
  return await consoles.find().toArray();
}

export async function getConsole(id) {
  return await consoles.findOne({ _id: new ObjectId(id) });
}
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFilter(search, category) {
  const filter = {};
  if (search) {
    filter.name = { $regex: escapeRegex(search), $options: "i" };
  }
  if (category) {
    filter.brand = category;
  }
  return filter;
}

export async function getConsolesPage(page, pageSize, search, category) {
  return await consoles
    .find(buildFilter(search, category))
    .sort({ _id: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();
}

export async function countConsoles(search, category) {
  return await consoles.countDocuments(buildFilter(search, category));
}

export async function updateConsole(id, data) {
  await consoles.updateOne({ _id: new ObjectId(id) }, { $set: data });
}
