import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'Le type doit être une chaîne' })
  @IsNotEmpty({ message: 'Le type est requis' })
  @IsIn(['B2B', 'B2C'], { message: 'Le type doit être B2B ou B2C' })
  type: string;

  @IsString({ message: 'La raison sociale doit être une chaîne' })
  @IsOptional()
  companyName?: string;

  @IsString({ message: 'Le nom complet doit être une chaîne' })
  @IsOptional()
  fullName?: string;

  @IsString({ message: 'Le téléphone doit être une chaîne' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'L\'adresse doit être une chaîne' })
  @IsOptional()
  address?: string;

  @IsString({ message: 'L\'email doit être une chaîne' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Le NIF/STAT doit être une chaîne' })
  @IsOptional()
  taxId?: string;
}
