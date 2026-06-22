import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
}

export class CreateStockMovementDto {
  @IsEnum(MovementType, { message: 'Le type de mouvement est invalide' })
  @IsNotEmpty({ message: 'Le type de mouvement est requis' })
  type: MovementType;

  @IsString({ message: 'La référence doit être une chaîne' })
  @IsOptional()
  reference?: string;

  @IsNumber({}, { message: 'La quantité modifiée doit être un nombre' })
  quantityChanged: number;

  @IsString({ message: 'L\'ID du produit doit être une chaîne' })
  @IsNotEmpty({ message: 'Le produit est requis' })
  productId: string;

  @IsString({ message: 'L\'ID du dépôt doit être une chaîne' })
  @IsNotEmpty({ message: 'Le dépôt est requis' })
  depotId: string;
}
