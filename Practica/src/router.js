import express from 'express';
import multer from 'multer';
import * as Games from './adminconsole.js';
import * as Consoles from './database.js';

const upload = multer({dest: 'uploads/'});

const router = express.Router();
export default router;

router.get('/', (req, res) => {
    res.render('HOME/HOME',{
        Consoles: Consoles.getConsoles()
    });
});

router.get('/getconsole/:id', async (req, res) => {
    res.render('PS5/PS5',{
        console: await Consoles.getConsole(req.params.id),
        games: await Games.getGames(req.params.id)
    });
});

