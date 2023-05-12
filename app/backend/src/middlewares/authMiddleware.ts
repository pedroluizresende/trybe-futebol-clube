import { RequestHandler } from 'express';

const authMiddleware: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  next();
};

export default authMiddleware;
