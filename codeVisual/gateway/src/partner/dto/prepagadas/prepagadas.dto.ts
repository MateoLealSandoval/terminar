 
import { IsString, IsIn } from "class-validator";


export enum typePaymentPrepagadas {
  SITE = 'SITE',
  ANTICIPATED = 'ANTICIPATED',
}

export class PrepagadasDto {
  
  @IsString()
  name: string;

  @IsIn(Object.values(typePaymentPrepagadas))
  type: typePaymentPrepagadas;
}
 