import express from 'express';
import multer from 'multer';
import * as Map from './database.js';

const upload = multer({dest: 'uploads/'});

const router = express.Router();
export default router;

router.get('/', (req, res) => {
    res.render('HOME/HOME',{
        Consoles: Map.getConsoles()
    });
});

router.get('/getconsole/:id', (req, res) => {
    res.render('PS5/PS5',{
        console: Map.getConsole(req.params.id),
    });
});

