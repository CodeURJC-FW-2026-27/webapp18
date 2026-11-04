import express from 'express';
import multer from 'multer';

const upload = multer({dest: 'uploads/'});

const router = express.Router();
export default router;