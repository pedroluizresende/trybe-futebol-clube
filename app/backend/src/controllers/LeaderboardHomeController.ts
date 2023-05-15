import { NextFunction, Request, Response } from 'express';
import LeaderboardHomeService from '../services/LeaderBoardHomeService';

class LeaderboardHomeController {
  static async getLeaderBoard(_req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const response = await LeaderboardHomeService.getLeaderBoard();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default LeaderboardHomeController;
