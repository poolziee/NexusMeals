import { UserSession } from '@app/common/dto/user-session-dto';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator<UserSession>(
  // TODO: Maybe throw if no user?
  (_data: unknown, context: ExecutionContext): UserSession => context.switchToHttp().getRequest().user,
);
