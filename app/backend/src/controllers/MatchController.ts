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

  static async uptade(req:Request, res:Response, next:NextFunction):Promise<void> {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    try {
      const response = await MatchService.update(Number(id), homeTeamGoals, awayTeamGoals);
      res.status(200).json({ updatedId: response });
    } catch (error) {
      next(error);
    }
  }

  static async create(req:Request, res:Response, next:NextFunction):Promise<void> {
    const newMatch = req.body;
    try {
      const response = await MatchService.create(newMatch);

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default MatchController;
