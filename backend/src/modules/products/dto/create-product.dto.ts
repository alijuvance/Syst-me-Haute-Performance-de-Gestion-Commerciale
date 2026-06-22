import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Le SKU (Référence) doit être une chaîne' })
  @IsNotEmpty({ message: 'Le SKU (Référence) est requis' })
  sku: string;

  @IsString({ message: 'Le code-barre doit être une chaîne' })
  @IsOptional()
  barcode?: string;

  @IsString({ message: 'Le nom doit être une chaîne' })
  @IsNotEmpty({ message: 'Le nom du produit est requis' })
  name: string;

  @IsString({ message: 'La description doit être une chaîne' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Le prix unitaire doit être un nombre' })
  @Min(0, { message: 'Le prix unitaire ne peut pas être inférieur à 0' })
  defaultPrice: number;

  @IsNumber({}, { message: 'Le coût d\'achat doit être un nombre' })
  @Min(0, { message: 'Le coût d\'achat ne peut pas être inférieur à 0' })
  costPrice: number;

  @IsString({ message: 'La catégorie est requise' })
  @IsNotEmpty({ message: 'Veuillez sélectionner une catégorie' })
  categoryId: string;
}
