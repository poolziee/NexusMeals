import { IsNotEmpty, Matches } from 'class-validator';
import { AutoMap } from '@automapper/classes';

const postalCodeRegex: RegExp = /^[0-9]{4}[A-Z]{2}$/m;

export class ReadChefsRequest {
  @AutoMap()
  @IsNotEmpty()
  city: string;

  @AutoMap()
  @IsNotEmpty()
  @Matches(postalCodeRegex)
  postalCode: string;

  @AutoMap()
  @IsNotEmpty()
  street: string;

  @AutoMap()
  @IsNotEmpty()
  houseNumber: string;
}

export class ReadChefCategoryOverviewDTO {
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  totalProducts: number;
}

export class UpdateChefCategoryOverviewDTO {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  chefId: number;

  @AutoMap()
  description: string;
}

export class ReadChefDTO {
  @AutoMap()
  id: number;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  @AutoMap()
  username: string;

  @AutoMap()
  city: string;

  @AutoMap()
  postalCode: string;

  @AutoMap()
  street: string;

  @AutoMap()
  houseNumber: string;

  @AutoMap()
  categoryOverview: ReadChefCategoryOverviewDTO[];
}
