import { MongoClient, ObjectId } from 'mongodb';
import { unlink } from 'node:fs/promises';

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('Games4LifeDB')
const games = db.collection('Games');

async function removeImage(image) {
    if (image?.startsWith('/uploads/')) {
        await unlink('.' + image).catch(() => {});
    }
}

export async function addGame(consoleId,game) {
    game.consoleId = new ObjectId(consoleId);
    await games.insertOne(game);
}

export async function updateGame(id, data) {
    const oldGame = await getGame(id);
    if (!oldGame) return;
    await games.updateOne({ _id: oldGame._id }, { $set: data });
    if (data.image && data.image !== oldGame.image) {
        await removeImage(oldGame.image);
    }
}

export async function deleteGame(id) {
    const game = await getGame(id);
    if (!game) return;
    await removeImage(game.image);
    await games.deleteOne({ _id: game._id });
}

export async function deleteAllGames(consoleId) {
    const consoleGames = await getGames(consoleId);
    await Promise.all(consoleGames.map(game => removeImage(game.image)));
    await games.deleteMany({ consoleId: new ObjectId(consoleId) });
}

export async function getGames(consoleId) {
    return await games.find({ consoleId: new ObjectId(consoleId) }).toArray();
}

export async function getGame(id) {
    return await games.findOne({_id: new ObjectId(id)});
}   


