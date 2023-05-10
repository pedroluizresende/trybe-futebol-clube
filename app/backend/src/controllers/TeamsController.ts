import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamsController {
  constructor(
    private teamService: TeamService,
  ) {

  }

  static async getAll(_req: Request, res: Response):Promise<void> {
    const teams = await TeamService.getAll();
    res.status(200).json(teams);
  }
}
