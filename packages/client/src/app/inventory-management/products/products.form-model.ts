import {
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormModel,
  DynamicInputModel,
  DynamicSelectModel,
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Product, ProductConversion } from './product.model';
import { Provider } from '../providers/provider.model';
import { URL_PATTERN } from '../../constants';
import { from } from 'rxjs';
import { Shelf } from '../shelves/shelf.model';

const BASE_PRODUCT = {} as Product;
const BASE_CONVERSION = {} as ProductConversion;

function getConversionGroups(originalProduct?: Product): DynamicFormArrayGroupModel[] | null {
  if (!originalProduct || !Array.isArray(originalProduct.conversions)) return null;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore Ask for unneeded $implicit variable
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return originalProduct.conversions.map(c => ({ group: conversionGroupFactory(c) }));
}

function conversionGroupFactory(conversion?: ProductConversion): DynamicInputModel[] {
  const value = conversion || BASE_CONVERSION;
  return [
    new DynamicInputModel({
      id: 'displayName',
      label: 'Label',
      value: value.displayName,
    }),
    new DynamicInputModel({
      id: 'unit',
      label: 'Unité',
      value: value.unit,
      validators: { min: 1, max: 3 },
    }),
    new DynamicInputModel({
      id: 'coef',
      label: 'Facteur multiplicateur',
      value: value.coef,
    }),
  ];
}

export function getProductModel(
  shelves: Promise<Shelf[]>,
  providers: Promise<Provider[]>,
  originalProduct?: Product,
): DynamicFormModel {
  const values = originalProduct || BASE_PRODUCT;

  const optionMap = (valueField, labelField) => arr => arr.map(b => ({
    value: b[valueField],
    label: b[labelField],
  }));


  return [
    new DynamicInputModel({ 
      id: 'name',
      label: 'Nom du produit',
      value: values.name,
      validators: { required: null },
    }),
    new DynamicInputModel({
      id: 'image',
      label: 'Lien vers une image',
      value: values.image,
      validators: { pattern: URL_PATTERN },
    }),
    new DynamicSelectModel<string>({
      id: 'shelf',
      label: 'Rayon',
      value: values.shelf && (values.shelf as Shelf)._id,
      validators: { required: null },
      options: from(shelves.then(optionMap('_id', 'name')),
      ),
    }),
    new DynamicSelectModel<string>({
      id: 'provider',
      label: 'Fournisseur',
      value: values.provider && (values.provider as Provider)._id,
      validators: { required: null },
      options: from(providers.then(optionMap('_id', 'name')),
      ),
    }),
    new DynamicInputModel({ 
      id: 'price',
      label: 'Prix',
      value: values.price,
    }),
    new DynamicFormArrayModel({
      id: 'conversions',
      label: 'Liste des conversions',
      initialCount: 1,
      groupFactory: conversionGroupFactory,
      groups: getConversionGroups(originalProduct),
    }),
  ];
}

export function getProductFromForm(form: FormGroup, originalProduct?: Product): Product {
  const value = form.value;
  const original = originalProduct || BASE_PRODUCT;
  return {
    _id: original._id,
    ...value,
  };
}
