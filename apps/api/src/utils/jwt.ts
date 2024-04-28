/* eslint-disable @typescript-eslint/no-namespace */
import jsonwebtoken, { SignOptions } from 'jsonwebtoken';

module jwt {
  export const signToken = (payload: { sessionId: string }, options: SignOptions = {}) => {
    return jsonwebtoken.sign(payload, process.env.SECRET_KEY, {
      ...options,
      algorithm: 'HS256',
    });
  };

  export const verifyToken = (token: string): { sessionId: string } | null => {
    try {
      return jsonwebtoken.verify(token, process.env.SECRET_KEY) as { sessionId: string };
    } catch (error) {
      return null;
    }
  };
}

export default jwt;
