import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || authHeader !== 'secret-key') {
      return false;
    }
    
    return true;
  }
}