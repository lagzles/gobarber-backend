import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // validação do token
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token não é valido/faltando', 401);
  }

  const [, token] = authHeader.split(' ');

  const { secret, expiresIn } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('Token invalido', 401);
  }
}