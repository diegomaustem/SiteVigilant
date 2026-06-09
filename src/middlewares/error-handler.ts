import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erro capturado:', err.stack);

  let status = 500;
  let message = err.message || 'Erro interno do servidor';

  if (
    err.name === 'ValidationError' ||
    err.type === 'entity.parse.failed' ||
    err.code === '23502' ||
    err.code === '22P02'
  ) {
    status = 400;
    message = 'Dados inválidos ou mal formatados.';
  }

  if (
    err.code === '23505' ||
    err.code === '23503'    
  ) {
    status = 409;
    message = 'Conflito: recurso já existe ou referência inválida.';
  }



  // Resposta amigável para o cliente
  res.status(status).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};