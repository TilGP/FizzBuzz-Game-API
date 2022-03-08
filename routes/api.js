import express from'express';
import { getRoundInfo, createGame, advanceProgress, getGameInfo, joinGame } from '../controllers/gameController.js';
const router = express.Router();

router.route('/game').post(createGame);

router.route('/game/:id?').get(getGameInfo);
router.route('/game/:id/join').post(joinGame);
    
router.route('/game/:id/round').post(advanceProgress);
router.route('/game/:id/round/').get(getRoundInfo);

    
export { router };