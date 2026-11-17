import express from "express";
import multer from "multer";
import * as Games from "./adminconsole.js";
import * as Consoles from "./database.js";

const upload = multer({ dest: "uploads/" });
const PAGE_SIZE = 6;

const CATEGORIES = [
  { label: "PlayStation", brand: "PlayStation" },
  { label: "Xbox", brand: "Xbox" },
  { label: "Nintendo", brand: "Nintendo" },
  { label: "Otros", brand: "Otros" },
];

const router = express.Router();
export default router;

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function consoleFromBody(body) {
  return {
    name: readText(body.name),
    brand: readText(body.brand),
    year: parseInt(body.year),
    price: parseFloat(body.price),
    rate: parseFloat(body.rate),
    description: readText(body.description),
  };
}

function buildHomeUrl(page, search, category) {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }
  if (category) {
    params.set("category", category);
  }
  if (page > 1) {
    params.set("page", page);
  }
  const query = params.toString();
  return query ? "/?" + query : "/";
}

function buildCategories(activeCategory) {
  return CATEGORIES.map((category) => ({
    label: category.label,
    url: buildHomeUrl(1, "", category.brand),
    active: category.brand === activeCategory,
  }));
}

function buildPages(page, totalPages, search, category) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({
      number: i,
      current: i === page,
      url: buildHomeUrl(i, search, category),
    });
  }
  return pages;
}

router.get("/", async (req, res) => {
  const search = readText(req.query.search);
  const category = readText(req.query.category);

  const totalConsoles = await Consoles.countConsoles(search, category);
  const totalPages = Math.max(1, Math.ceil(totalConsoles / PAGE_SIZE));
  const page = Math.min(Math.max(parseInt(req.query.page) || 1, 1), totalPages);

  res.render("HOME/HOME", {
    Consoles: await Consoles.getConsolesPage(page, PAGE_SIZE, search, category),
    hasResults: totalConsoles > 0,
    search: search,
    categories: buildCategories(category),
    allActive: category === "",
    pages: buildPages(page, totalPages, search, category),
    hasPrevious: page > 1,
    previousUrl: buildHomeUrl(page - 1, search, category),
    hasNext: page < totalPages,
    nextUrl: buildHomeUrl(page + 1, search, category),
  });
});

router.get("/getconsole/:id", async (req, res) => {
  res.render("PS5/PS5", {
    console: await Consoles.getConsole(req.params.id),
    games: await Games.getGames(req.params.id),
  });
});

router.get("/console/new", (req, res) => {
  res.render("consoleForm", {
    action: "/console/new",
    submitText: "Añadir consola",
    cancelUrl: "/",
    isNew: true,
  });
});

router.get("/console/:id/edit", async (req, res) => {
  const console = await Consoles.getConsole(req.params.id);
  if (!console) {
    return res.status(404).send("Consola no encontrada");
  }

  res.render("consoleForm", {
    console: console,
    action: `/console/${console._id}/edit`,
    submitText: "Guardar cambios",
    cancelUrl: `/getconsole/${console._id}`,
    isPlayStation: console.brand === "PlayStation",
    isXbox: console.brand === "Xbox",
    isNintendo: console.brand === "Nintendo",
    isOtros: console.brand === "Otros",
  });
});

router.post("/console/:id/edit", upload.fields([{ name: "imagepreview", maxCount: 1 }, { name: "imagemain", maxCount: 1 }]), async (req, res) => {
  const data = consoleFromBody(req.body);
  if (!data.name || !data.brand) {
    return res.status(400).send("Faltan campos obligatorios");
  }

  const imagePreview = req.files && req.files.imagepreview && req.files.imagepreview[0];
  const imageMain = req.files && req.files.imagemain && req.files.imagemain[0];
  if (imagePreview) {
    data.imagepreview = "/uploads/" + imagePreview.filename;
  }
  if (imageMain) {
    data.imagemain = "/uploads/" + imageMain.filename;
  }

  await Consoles.updateConsole(req.params.id, data);
  res.redirect(`/getconsole/${req.params.id}`);
});

router.post("/console/new", upload.fields([{ name: 'imagepreview', maxCount: 1 }, { name: 'imagemain', maxCount: 1 }]), async (req, res) => {
    const imagePreview = req.files && req.files.imagepreview && req.files.imagepreview[0];
    const imageMain = req.files && req.files.imagemain && req.files.imagemain[0];
    if (!imagePreview || !imageMain) {
        return res.status(400).send("Debes subir las dos imágenes para crear una consola");
    }

    const console = {
        name: req.body.name,
        brand: req.body.brand,
        year: req.body.year,
        imagepreview: "/uploads/" + imagePreview.filename,
        imagemain: "/uploads/" + imageMain.filename,
        price: req.body.price,
        rate: req.body.rate,
        description: req.body.description
    };
    await Consoles.addConsole(console);
    res.redirect('/');
});

router.post('/delete_console', async (req, res) => {
    await Consoles.deleteConsole(req.body.id);
    res.redirect('/');
});