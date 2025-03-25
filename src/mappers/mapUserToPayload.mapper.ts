import { AuthPayloadDto } from '../auth/dto/auth-payload.dto';
import { UserDocument } from '../schemas/user.schema';

export function mapUserToPayload(user: UserDocument): AuthPayloadDto {
  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role,
  };
}
