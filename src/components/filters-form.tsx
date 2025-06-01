'use client';
import { useState, useRef, type Dispatch, type SetStateAction } from 'react';
import { Divider, Box, Button } from '@mui/material';
import { type ProductProjection } from '@commercetools/platform-sdk';
import { useRouter } from 'next/navigation';
import YearPriceFilters from '@/components/years-price-filter';
import AuthorFilter from '@/components/author-filters';
import CategoryList from '@/components/categories-list';
import { type FilterOption, type CategoryWithChildren } from '@/components/catalog';

type FilterFormProps = {
  products: ProductProjection[];
  categories: CategoryWithChildren[];
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
  setFilterOption: Dispatch<SetStateAction<FilterOption>>;
  handleFilterApply: (data: FilterOption) => Promise<void>;
};

export default function FilterForm({
  products,
  categories,
  categoryId,
  setCategoryId,
  setFilterOption,
  handleFilterApply,
}: FilterFormProps) {
  const router = useRouter();
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const authorsContainerReference = useRef<HTMLDivElement | null>(null);
  const [publicationYearFrom, setPublicationYearFrom] = useState<string>('');
  const [publicationYearTo, setPublicationYearTo] = useState<string>('');
  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');

  const uniqueAuthors = [
    ...new Set(
      products
        .map((product) => {
          const authorAttribute = product.masterVariant?.attributes?.find((attribute) => attribute.name === 'author');
          return typeof authorAttribute?.value === 'string' ? authorAttribute.value : '';
        })
        .filter((author) => author !== ''),
    ),
  ];

  const handleCategoryClick = async (categoryId: string) => {
    setCategoryId(categoryId);

    const newFilterOption = {
      categoryId: categoryId,
      authors: selectedAuthors ?? undefined,
      yearOfPublication: {
        min: publicationYearFrom ? Number(publicationYearFrom) : 0,
        max: publicationYearTo ? Number(publicationYearTo) : 3000,
      },
      priceRange: {
        min: priceFrom ? Number(priceFrom) * 100 : 0,
        max: priceTo ? Number(priceTo) * 100 : 100_000,
      },
    };

    setFilterOption(newFilterOption);
    await handleFilterApply(newFilterOption);
  };

  const handleApplyButton = async () => {
    const newFilterOption = {
      categoryId: categoryId,
      authors: selectedAuthors ?? undefined,
      yearOfPublication: {
        min: publicationYearFrom ? Number(publicationYearFrom) : 0,
        max: publicationYearTo ? Number(publicationYearTo) : 3000,
      },
      priceRange: {
        min: priceFrom ? Number(priceFrom) * 100 : 0,
        max: priceTo ? Number(priceTo) * 100 : 100_000,
      },
    };

    setFilterOption(newFilterOption);
    await handleFilterApply(newFilterOption);
  };

  const handleResetButton = async () => {
    setCategoryId(null);
    setSelectedAuthors([]);
    setPublicationYearFrom('');
    setPublicationYearTo('');
    setPriceFrom('');
    setPriceTo('');
    setFilterOption({});
    router.replace('/catalog');
    await handleFilterApply({});
  };

  return (
    <Box
      sx={{
        flex: '1 1 25%',
        minWidth: 250,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <CategoryList categories={categories} handleCategoryClick={handleCategoryClick} selectedCategoryId={categoryId} />

      <Divider flexItem />

      <AuthorFilter
        authors={uniqueAuthors}
        selectedAuthors={selectedAuthors}
        setSelectedAuthors={setSelectedAuthors}
        authorsContainerReference={authorsContainerReference}
      />

      <YearPriceFilters
        publicationYearFrom={publicationYearFrom}
        publicationYearTo={publicationYearTo}
        setPublicationYearFrom={setPublicationYearFrom}
        setPublicationYearTo={setPublicationYearTo}
        priceFrom={priceFrom}
        priceTo={priceTo}
        setPriceFrom={setPriceFrom}
        setPriceTo={setPriceTo}
      />

      <Button variant="contained" fullWidth sx={{ maxWidth: 200 }} onClick={() => void handleApplyButton()}>
        Apply
      </Button>
      <Button variant="text" fullWidth sx={{ maxWidth: 200 }} onClick={() => void handleResetButton()}>
        Reset
      </Button>
    </Box>
  );
}
