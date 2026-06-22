import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateSupplierDto {
  @IsString({ message: 'Le nom doit être une chaîne' })
  @IsNotEmpty({ message: 'Le nom du fournisseur est requis' })
  name: string;

  @IsString({ message: 'Le nom du contact doit être une chaîne' })
  @IsOptional()
  contactName?: string;

  @IsEmail({}, { message: 'L\'email doit être une adresse valide' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Le téléphone doit être une chaîne' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'L\'adresse doit être une chaîne' })
  @IsOptional()
  address?: string;

  @IsString({ message: 'Le NIF/STAT doit être une chaîne' })
  @IsOptional()
  taxId?: string;
}
