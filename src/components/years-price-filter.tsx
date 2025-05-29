// YearPriceFilters.tsx
import React from 'react';
import { TextField, Box, Typography } from '@mui/material';

type YearPriceFiltersProps = {
  publicationYearFrom: string;
  publicationYearTo: string;
  setPublicationYearFrom: (value: string) => void;
  setPublicationYearTo: (value: string) => void;
  priceFrom: string;
  priceTo: string;
  setPriceFrom: (value: string) => void;
  setPriceTo: (value: string) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
};

const YearPriceFilters: React.FC<YearPriceFiltersProps> = ({
  publicationYearFrom,
  publicationYearTo,
  setPublicationYearFrom,
  setPublicationYearTo,
  priceFrom,
  priceTo,
  setPriceFrom,
  setPriceTo,
  handleKeyPress,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ alignSelf: 'flex-start' }}>
        Publication Year
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', maxWidth: 230 }}>
        <TextField
          size="small"
          placeholder="From"
          type="number"
          value={publicationYearFrom}
          onChange={(event) => setPublicationYearFrom(event.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Typography>-</Typography>
        <TextField
          size="small"
          placeholder="To"
          type="number"
          value={publicationYearTo}
          onChange={(event) => setPublicationYearTo(event.target.value)}
          onKeyDown={handleKeyPress}
        />
      </Box>

      <Typography variant="h6" sx={{ alignSelf: 'flex-start' }}>
        Price
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', maxWidth: 230 }}>
        <TextField
          size="small"
          placeholder="From"
          type="number"
          value={priceFrom}
          onChange={(event) => setPriceFrom(event.target.value)}
        />
        <Typography>-</Typography>
        <TextField
          size="small"
          placeholder="To"
          type="number"
          value={priceTo}
          onChange={(event) => setPriceTo(event.target.value)}
        />
      </Box>
    </Box>
  );
};

export default YearPriceFilters;
