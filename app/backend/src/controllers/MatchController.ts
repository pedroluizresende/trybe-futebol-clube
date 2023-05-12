import { NextFunction, Request, Response } from 'express';
import MatchService from '../services/MatchService';

class MatchController {
  static async getAll(req:Request, res:Response): Promise<void> {
    const { inProgress } = req.query;

    let matches;
    if (inProgress && typeof inProgress === 'string') {
      console.log(inProgress);
      matches = await MatchService.matchesFilteredByInProgress(inProgress);
    } else {
      // Chame a função que busca todas as partidas no banco de dados
      matches = await MatchService.getAll();
    }

    res.status(200).json(matches);
  }

  static async updateInProgres(req:Request, res:Response, next:NextFunction):Promise<void> {
    const { id } = req.params;
    try {
      const response = await MatchService.updateInProgress(Number(id));
      res.status(200).json({ message: response });
    } catch (error) {
      next(error);
    }
  }
}

export default MatchController;
