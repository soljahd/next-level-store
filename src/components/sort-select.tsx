import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

type SortSelectProps = {
  sortOption: string;
  handlePopularChange: (event: SelectChangeEvent) => Promise<void>;
};

const SortSelect: React.FC<SortSelectProps> = ({ sortOption, handlePopularChange }) => {
  return (
    <FormControl sx={{ width: 200 }}>
      <Select
        variant="standard"
        value={sortOption}
        onChange={(event) => void handlePopularChange(event)}
        MenuProps={{ disableScrollLock: true }}
      >
        <MenuItem value="name.en asc">Name: from A to Z</MenuItem>
        <MenuItem value="name.en desc">Name: from Z to A</MenuItem>
        <MenuItem value="price asc">Price: High to Low</MenuItem>
        <MenuItem value="price desc">Price: Low to High</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortSelect;
