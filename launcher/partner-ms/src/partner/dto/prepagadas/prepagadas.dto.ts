import { typePaymentPrepagadas} from "@prisma/client";
import { IsString, IsIn } from "class-validator";

export class PrepagadasDto {
  
  @IsString()
  name: string;

  @IsIn(Object.values(typePaymentPrepagadas))
  type: typePaymentPrepagadas;
}
 