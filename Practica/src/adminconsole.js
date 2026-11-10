import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('Games4LifeDB')
const games = db.collection('Games');


export async function addGame(consoleId,game) {
    game.consoleId = consoleId;
    await games.insertOne(game);
}

export async function deleteGame(id) {
    await games.deleteOne({_id: new ObjectId(id)}); 
}

export async function deleteAllGames(consoleId) {
    await games.deleteMany({consoleId: consoleId});
}

export async function getGames(consoleId) {
    return await games.find({ consoleId: new ObjectId(consoleId) }).toArray();
}

export async function getGame(id) {
    return await games.findOne({_id: new ObjectId(id)});
}   


