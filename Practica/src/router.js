import express from "express";
import multer from "multer";
import * as Games from "./adminconsole.js";
import * as Consoles from "./database.js";
import { unlink } from "node:fs/promises";


const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

function imageFilter(req, file, cb) {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.invalidImage = true;
    cb(null, false);
  }
}

const upload = multer({ dest: "uploads/", fileFilter: imageFilter });
const PAGE_SIZE = 6;

const CATEGORIES = [
  { label: "Sony", brand: "Sony" },
  { label: "Xbox", brand: "Xbox" },
  { label: "Nintendo", brand: "Nintendo" },
  { label: "Otros", brand: "Otros" },
];



const router = express.Router();
export default router;

// Middleware to build categories for all routes (header).
router.use((req, res, next) => {
  res.locals.categories = buildCategories("");
  next();
});

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

const VALID_PEGI = [3, 7, 12, 16, 18];

function gameFromBody(body, file) {
  return {
    name: readText(body.name),
    price: parseFloat(body.price),
    ReleaseDate: new Date(body.date),
    pegi: parseInt(body.pegi),
    developer: readText(body.developer),
    genre: readText(body.genre),
    image: file ? "/uploads/" + file.filename : "",
    description: readText(body.description),
  };
}

function validateGame(game) {
  const errors = [];
  if (!game.name || !/^[\p{Lu}\d]/u.test(game.name)) {
    errors.push("Nombre inválido. Es obligatorio y debe empezar por mayúscula o número.");
  }
  if (isNaN(game.price) || game.price < 0) {
    errors.push("Precio inválido. Debe ser un número mayor o igual que 0.");
  }
  if (isNaN(game.ReleaseDate.getTime())) {
    errors.push("Fecha de salida inválida.");
  }
  if (!VALID_PEGI.includes(game.pegi)) {
    errors.push("PEGI inválido.");
  }
  if (!game.developer || !game.genre) {
    errors.push("Desarrollador y género son obligatorios.");
  }
  if (game.description.length < 10 || game.description.length > 800) {
    errors.push("Descripción inválida. Debe tener entre 10 y 800 caracteres.");
  }
  return errors;
}

async function removeUploadedFiles(files = {}) {
  const uploadedFiles = Object.values(files).flat();
  await Promise.all(uploadedFiles.map(file => unlink(file.path).catch(() => {})));
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

  res.render("consoleForm", {
    console: console,
    action: `/console/${console._id}/edit`,
    submitText: "Guardar cambios",
    cancelUrl: `/getconsole/${console._id}`,
    isPlayStation: console.brand === "Sony",
    isXbox: console.brand === "Xbox",
    isNintendo: console.brand === "Nintendo",
    isOtros: console.brand === "Otros",
  });
});

router.post("/console/:id/edit", upload.fields([{ name: "imagepreview", maxCount: 1 }, { name: "imagemain", maxCount: 1 }]), async (req, res) => {

  const name = readText(req.body.name);
  const description = readText(req.body.description);
  const validName = await Consoles.validName(name, req.params.id);
  const firstMayus = /^[\p{Lu}\d]/u.test(name);
  const validDescription = description.length > 10 && description.length < 800;

  if (validName && validDescription && firstMayus && !req.invalidImage) {
    const data = consoleFromBody(req.body);
    const imagePreview = req.files && req.files.imagepreview && req.files.imagepreview[0];
    const imageMain = req.files && req.files.imagemain && req.files.imagemain[0];
    if (imagePreview) {
      data.imagepreview = "/uploads/" + imagePreview.filename;
    }
    if (imageMain) {
      data.imagemain = "/uploads/" + imageMain.filename;
    }

    await Consoles.updateConsole(req.params.id, data);

    res.render('MessagePage', { message: "Consola actualizada correctamente", succed: true, id: req.params.id });

  } else {
    let message = "";
    if (!validName) {
      message = message + "El nombre de la consola ya existe.\n";
    }
    if (!firstMayus) {
      message = message + "Nombre es inválido. El primer caracter debe ser mayúscula o número.\n";
    }
    if (!validDescription) {
      message = message + "Descripción inválida. Debe tener entre 10 y 800 caracteres.\n";
    }
    if (req.invalidImage) {
      message = message + "La imagen debe ser JPG, JPEG o PNG.\n";
    }

    await removeUploadedFiles(req.files);
    res.render("MessagePage", { message, erroredit: true, id: req.params.id });
  }
});

router.post("/console/new", upload.fields([{ name: 'imagepreview', maxCount: 1 }, { name: 'imagemain', maxCount: 1 }]), async (req, res) => {

  const name = readText(req.body.name);
  const description = readText(req.body.description);
  const validName = await Consoles.validName(name);
  const firstMayus = /^[\p{Lu}\d]/u.test(name);
  const validDescription = description.length > 10 && description.length < 800;

  if (validName && validDescription && firstMayus && !req.invalidImage) {

    const console = consoleFromBody(req.body);
    const imagePreview = req.files && req.files.imagepreview && req.files.imagepreview[0];
    const imageMain = req.files && req.files.imagemain && req.files.imagemain[0];
    if (imagePreview) {
      console.imagepreview = "/uploads/" + imagePreview.filename;
    }
    if (imageMain) {
      console.imagemain = "/uploads/" + imageMain.filename;
    }

    const id = await Consoles.addConsole(console);

    res.render('MessagePage', { message: "Consola añadida correctamente", succed: true, id: id });

  } else {

    let message = "";
    if (!validName) {
      message = message + "El nombre de la consola ya existe.\n";
    }
    if (!firstMayus) {
      message = message + "Nombre es inválido. El primer caracter debe ser mayúscula o número.\n";
    }
    if (!validDescription) {
      message = message + "Descripción inválida. Debe tener entre 10 y 800 caracteres.\n";
    }
    if (req.invalidImage) {
      message = message + "La imagen debe ser JPG, JPEG o PNG.\n";
    }

    await removeUploadedFiles(req.files);
    res.render('MessagePage', { message, errorcreate: true });
  }
});
router.get("/console/:id/game/new", (req, res) => {
    res.render("gameForm", {
        action: `/console/${req.params.id}/game/new`,
        cancelUrl: `/getconsole/${req.params.id}`,
        submitText: "Añadir videojuego",
        pegiOptions: VALID_PEGI.map(p => ({
            value: p,
            selected: false
        }))
    });
});

router.post("/console/:id/game/new", upload.single("image"), async (req, res) => {
  const game = gameFromBody(req.body, req.file);
  const errors = validateGame(game);

  if (req.invalidImage) {
    errors.push("La imagen debe ser JPG, JPEG o PNG.");
  } else if (!game.image) {
    errors.push("La imagen es obligatoria.");
  }

  if (errors.length > 0) {
    if (req.file) {
        await unlink(req.file.path).catch(() => {});
    }

    res.render("MessagePage", {
        message: errors.join("\n"),
        errorgamecreate: true,
        id: req.params.id,
        savedGameData: encodeURIComponent(JSON.stringify(req.body))
    });

    return;
}

  await Games.addGame(req.params.id, game);
  res.render("MessagePage", { message: "Videojuego añadido correctamente", succed: true, id: req.params.id });
});

router.get("/console/:id/game/:gameId/edit", async (req, res) => {
  const game = await Games.getGame(req.params.gameId);
  if (!game) {
    res.redirect(`/getconsole/${req.params.id}`);
    return;
  }

  res.render("gameForm", {
    game: game,
    releaseDate: game.ReleaseDate.toISOString().slice(0, 10),
    pegiOptions: VALID_PEGI.map(p => ({ value: p, selected: p === game.pegi })),
    action: `/console/${req.params.id}/game/${game._id}/edit`,
    cancelUrl: `/getconsole/${req.params.id}`,
    submitText: "Guardar cambios",
  });
});

router.get('/delete_console/:id', async (req, res) => {
  await Consoles.deleteConsole(req.params.id);
  await Games.deleteAllGames(req.params.id);
  res.render('MessagePage', { message: "Consola eliminada correctamente", deleted: true });
});

router.post("/console/:id/game/:gameId/edit", upload.single("image"), async (req, res) => {
  const game = gameFromBody(req.body, req.file);
  const errors = validateGame(game);

  if (req.invalidImage) {
    errors.push("La imagen debe ser JPG, JPEG o PNG.");
  }

  if (errors.length > 0) {
    if (req.file) {
      await unlink(req.file.path).catch(() => {});
    }
   res.render("MessagePage", {
        message: errors.join("\n"),
        errorgameedit: true,
        id: req.params.id,
        gameId: req.params.gameId
    });
    return;
  }

  if (!game.image) {
    delete game.image;
  }

  await Games.updateGame(req.params.gameId, game);
  res.render("MessagePage", { message: "Videojuego actualizado correctamente", succed: true, id: req.params.id });
});

router.get("/console/:id/game/:gameId/delete", async (req, res) => {
    await Games.deleteGame(req.params.gameId);

    res.render("MessagePage", {
        message: "Videojuego eliminado correctamente",
        gameDeleted: true,
        consoleUrl: `/getconsole/${req.params.id}`
    });
});
