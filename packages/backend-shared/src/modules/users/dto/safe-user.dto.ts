import { PreferredLanguage } from '../../../common/enums/preferred-language.enum';

export class SafeUserDto {
  id!: string;
  email!: string;
  fullName!: string;
  emailVerified!: boolean;
  isAdmin!: boolean;
  preferredLanguage!: PreferredLanguage;
  createdAt!: Date;
  updatedAt!: Date;
}
