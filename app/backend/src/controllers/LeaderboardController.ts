import { NextFunction, Request, Response } from 'express';
import LeaderboardHomeService from '../services/LeaderboardHomeService';
import LeaderboardAwayService from '../services/LeaderBoardAwayService';

class LeaderboardController {
  static async getHomeLeaderBoard(_req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const response = await LeaderboardHomeService.getLeaderBoard();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAwayLeaderBoard(_req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const response = await LeaderboardAwayService.getLeaderBoard();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default LeaderboardController;
