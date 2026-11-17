import express from 'express';
import multer from 'multer';
import * as Games from './adminconsole.js';
import * as Consoles from './database.js';

const upload = multer({dest: 'uploads/'});
const PAGE_SIZE = 6;

const CATEGORIES = [
    { label: 'PlayStation', brand: 'PlayStation' },
    { label: 'Xbox', brand: 'Xbox' },
    { label: 'Nintendo', brand: 'Nintendo' },
    { label: 'Otros', brand: 'Otros' }
];

const router = express.Router();
export default router;

function readText(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function buildHomeUrl(page, search, category) {
    const params = new URLSearchParams();
    if (search) {
        params.set('search', search);
    }
    if (category) {
        params.set('category', category);
    }
    if (page > 1) {
        params.set('page', page);
    }
    const query = params.toString();
    return query ? '/?' + query : '/';
}

function buildCategories(activeCategory) {
    return CATEGORIES.map(category => ({
        label: category.label,
        url: buildHomeUrl(1, '', category.brand),
        active: category.brand === activeCategory
    }));
}

function buildPages(page, totalPages, search, category) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push({
            number: i,
            current: i === page,
            url: buildHomeUrl(i, search, category)
        });
    }
    return pages;
}

router.get('/', async (req, res) => {
    const search = readText(req.query.search);
    const category = readText(req.query.category);

    const totalConsoles = await Consoles.countConsoles(search, category);
    const totalPages = Math.max(1, Math.ceil(totalConsoles / PAGE_SIZE));
    const page = Math.min(Math.max(parseInt(req.query.page) || 1, 1), totalPages);

    res.render('HOME/HOME', {
        Consoles: await Consoles.getConsolesPage(page, PAGE_SIZE, search, category),
        hasResults: totalConsoles > 0,
        search: search,
        categories: buildCategories(category),
        allActive: category === '',
        pages: buildPages(page, totalPages, search, category),
        hasPrevious: page > 1,
        previousUrl: buildHomeUrl(page - 1, search, category),
        hasNext: page < totalPages,
        nextUrl: buildHomeUrl(page + 1, search, category)
    });
});

router.get('/getconsole/:id', async (req, res) => {
    res.render('PS5/PS5',{
        console: await Consoles.getConsole(req.params.id),
        games: await Games.getGames(req.params.id)
    });
});

