import { NextFunction, Request, Response } from 'express';
import MatchService from '../services/MatchService';

class MatchController {
  static async getAll(_req:Request, res:Response, next: NextFunction): Promise<void> {
    try {
      const matches = await MatchService.getAll();

      res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  }
}

export default MatchController;
