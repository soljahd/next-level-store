import type { ByProjectKeyProductProjectionsSearchRequestBuilder } from '@commercetools/platform-sdk';
import { apiRoot } from '@/lib/commercetools/client';

type ProductSearchQueryArguments = NonNullable<
  Parameters<ByProjectKeyProductProjectionsSearchRequestBuilder['get']>[0]
>['queryArgs'];

type ProductSortField = 'name' | 'price';
type ProductSortDirection = 'asc' | 'desc';
type ProductSortOption = `${ProductSortField} ${ProductSortDirection}`;

type SearchProductsParameters = {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  fuzzy?: boolean;
  fuzzyLevel?: number;
  sort?: ProductSortOption;
  categoryId?: string;
  authors?: string[];
  yearOfPublication?: {
    min?: number;
    max?: number;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
};

export async function searchProducts(parameters: SearchProductsParameters) {
  try {
    const queryArguments: ProductSearchQueryArguments = {
      limit: parameters.limit || 20,
      offset: parameters.offset || 0,
    };

    if (parameters.searchQuery) {
      queryArguments['text.en'] = parameters.searchQuery;
      if (parameters.fuzzy) {
        queryArguments.fuzzy = parameters.fuzzy;
        queryArguments.fuzzyLevel = parameters.fuzzyLevel || 1;
      }
    }

    const filters: string[] = [];

    if (parameters.categoryId) {
      filters.push(`categories.id:"${parameters.categoryId}"`);
    }

    if (parameters.priceRange) {
      const priceParts = [];
      if (parameters.priceRange.min !== undefined) {
        priceParts.push(parameters.priceRange.min);
      }
      if (parameters.priceRange.max !== undefined) {
        priceParts.push(parameters.priceRange.max);
      }
      if (priceParts.length > 0) {
        filters.push(`variants.price.centAmount:range (${priceParts.join(' to ')})`);
      }
    }

    if (parameters.yearOfPublication) {
      const yearParts = [];
      if (parameters.yearOfPublication.min !== undefined) {
        yearParts.push(parameters.yearOfPublication.min);
      }
      if (parameters.yearOfPublication.max !== undefined) {
        yearParts.push(parameters.yearOfPublication.max);
      }
      if (yearParts.length > 0) {
        filters.push(`variants.attributes.yearOfPublication:range (${yearParts.join(' to ')})`);
      }
    }

    if (parameters.authors && parameters.authors.length > 0) {
      if (parameters.authors.length === 1) {
        filters.push(`variants.attributes.author:"${parameters.authors[0]}"`);
      } else {
        const authorFilters = parameters.authors.map((author) => `variants.attributes.author:"${author}"`);
        filters.push(`(${authorFilters.join(' or ')})`);
      }
    }

    if (filters.length > 0) {
      queryArguments.filter = filters.length === 1 ? filters[0] : filters;
    }

    if (parameters.sort) {
      queryArguments.sort = parameters.sort;
    }

    const response = await apiRoot.productProjections().search().get({ queryArgs: queryArguments }).execute();

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}

export async function getAllCategories() {
  try {
    const response = await apiRoot.categories().get().execute();

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}
