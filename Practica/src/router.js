import express from 'express';
import multer from 'multer';
import * as Games from './adminconsole.js';
import * as Consoles from './database.js';

const upload = multer({dest: 'uploads/'});
const PAGE_SIZE = 6;

const router = express.Router();
export default router;

router.get('/', async (req, res) => {
    const totalConsoles = await Consoles.countConsoles();
    const totalPages = Math.max(1, Math.ceil(totalConsoles / PAGE_SIZE));
    const page = Math.min(Math.max(parseInt(req.query.page) || 1, 1), totalPages);

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push({
            number: i,
            current: i === page
        });
    }

    res.render('HOME/HOME', {
        Consoles: await Consoles.getConsolesPage(page, PAGE_SIZE),
        pages: pages,
        hasPrevious: page > 1,
        previousPage: page - 1,
        hasNext: page < totalPages,
        nextPage: page + 1
    });
});

router.get('/getconsole/:id', async (req, res) => {
    res.render('PS5/PS5',{
        console: await Consoles.getConsole(req.params.id),
        games: await Games.getGames(req.params.id)
    });
});

