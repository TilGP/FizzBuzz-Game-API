import { validate } from './validationController.js';
import shortid from 'shortid';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { JSONFile, Low } from 'lowdb';

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, '../models', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

const writeRead = async () => {
    await db.write();
    await db.read();
    if(!db.data.games){
        db.data = { games: [] }
    }
}

const createGame = async (req, res) => {
    await writeRead();
    if (!req.body.name) return res.status(400).send('"name" parameter is required in body')
    var id = shortid.generate();
    db.data.games.push({
        id: id,
        roundsPlayied: 0,
        players: [
            {
                name: req.body.name
            }
        ],
        round: 
            {
                player: String,
                number: 0,
                word: '',
                triesRemaining: 5
            }
    });
    for (var i = 0; i < db.data.games.length; i++){
        if (db.data.games[i].id === id) return res.status(200).json(db.data.games[i]);
    }

    return res.status(200).send(db.data.games);
}

const getGameInfo = async (req, res) => {
    await writeRead();
    if (!db.data.games) return res.status(200).send('There are currently are no games! create one by sending a POST');
    if (!req.params.id){
        return res.send(db.data.games);
    }

    for(var i = 0; i < db.data.games.length; i++){
        if (db.data.games[i].id === req.params.id) return res.status(200).json(db.data.games[i]);
    }

    return res.status(400).send('No game found with this ID');
}

const joinGame = async (req, res) => {
    await writeRead();
    if (!req.params.id){
        return res.status(400).send('ID Parameter is required');
    }

    for(var i = 0; i < db.data.games.length; i++){
        if (db.data.games[i].id === req.params.id) {
            db.data.games[i].players.push({
                name: req.body.name
            });
            return res.status(200).json(db.data.games[i]);
        }
    }

    return res.status(400).send('No game found with this ID');
}

const getRoundInfo = async (req, res) => {
    if (!req.params.id){
        return res.status(400).send('ID Parameter is required');
    }

    for(var i = 0; i < db.data.games.length; i++){
        if (db.data.games[i].id === req.params.id) {
            return res.status(200).json(db.data.games[i].round);
        }
        
    }

    return res.status(400).send('No game found with this ID');
}

const advanceProgress = async (req, res) => {
    await writeRead();
    if (!req.params.id){
        return res.status(400).send('ID Parameter is required');
    }

    for(var i = 0; i < db.data.games.length; i++){
        if (db.data.games[i].id === req.params.id) {
            const { number, word, name } = req.body;
            const playerIsInPlayerList = (player) => {
                for (var j = 0; j < db.data.games[i].players.length; j++){
                    if (player === db.data.games[i].players[j].name) return true;
                }
                return false;
            }
            if (!playerIsInPlayerList(name)) {
                return res.status(403).send("You didn't join this game!")
            }
            if (validate(db.data.games[i].round.number, number, word)) {
                db.data.games[i].round.number = number;
                db.data.games[i].round.word = word;
                db.data.games[i].round.player = name;
                
                return res.status(200).send(db.data.games[i].round);
            } else {
                db.data.games[i].round.triesRemaining -= 1;
                if (db.data.games[i].round.triesRemaining === 0) {
                    db.data.games[i].round.number = 0;
                    db.data.games[i].round.word = '';
                    db.data.games[i].round.player = undefined;
                    db.data.games[i].roundsPlayied += 1;
                    db.data.games[i].round.triesRemaining = 5;
                    return res.status(400).send('Round ended! start again from 0!')
                }
                return res.status(400).json(db.data.games[i].round)
            }
        }
    }

    return res.status(400).send('No game found with this ID');
}

export { getRoundInfo, createGame, advanceProgress, getGameInfo, joinGame };