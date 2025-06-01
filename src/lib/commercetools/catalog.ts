import type { ByProjectKeyProductProjectionsSearchRequestBuilder } from '@commercetools/platform-sdk';
import { apiRoot } from '@/lib/commercetools/client';

type ProductSearchQueryArguments = NonNullable<
  Parameters<ByProjectKeyProductProjectionsSearchRequestBuilder['get']>[0]
>['queryArgs'];

// type ProductSortField = 'name.en' | 'price';
// type ProductSortDirection = 'asc' | 'desc';
// type ProductSortOption = `${ProductSortField} ${ProductSortDirection}`;

export type SearchProductsParameters = {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  fuzzy?: boolean;
  fuzzyLevel?: number;
  sort?: string;
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
        filters.push(`variants.attributes.pages:range (${yearParts.join(' to ')})`);
      }
    }

    if (parameters.authors && parameters.authors.length > 0) {
      const authorValues = parameters.authors.map((author) => `"${author}"`).join(',');
      filters.push(`variants.attributes.author:${authorValues}`);
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

export async function getAllProducts() {
  try {
    const response = await apiRoot
      .productProjections()
      .get({ queryArgs: { limit: 100, offset: 0 } })
      .execute();

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}

export async function getAllCategories() {
  try {
    const response = await apiRoot
      .categories()
      .get({ queryArgs: { expand: ['parent'], sort: 'orderHint asc' } })
      .execute();

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}
