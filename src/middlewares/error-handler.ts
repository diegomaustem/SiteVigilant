import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erro capturado:', err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err.name === 'ValidationError' ||
    err.type === 'entity.parse.failed' ||
    err.code === '23502' ||
    err.code === '22P02'
  ) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos ou mal formatados.',
    });
  }

  if (
    err.code === '23505' ||
    err.code === '23503'
  ) {
    return res.status(409).json({
      success: false,
      message: 'Conflito: recurso já existe ou referência inválida.',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.',
  });
};