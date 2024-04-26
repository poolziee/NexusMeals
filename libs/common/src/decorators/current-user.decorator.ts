import { UserSession } from '@app/common/dto/user-session-dto';
import { UnexpectedError } from '@app/common/errors/UnexpectedError';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator<UserSession>(
  // TODO: Maybe throw if no user?
  (_data: unknown, context: ExecutionContext): UserSession => {
    const contextType = context.getType();
    let user: UserSession | undefined;
    if (contextType === 'http') {
      user = context.switchToHttp().getRequest().user;
    } else if (contextType === 'rpc') {
      user = context.switchToRpc().getData().user;
    }
    if (!user) {
      throw new UnexpectedError('User not found in ExecutionContext.');
    }
    return user;
  },
);
