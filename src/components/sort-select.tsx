import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

type SortSelectProps = {
  popularOption: string;
  handlePopularChange: (event: SelectChangeEvent) => void;
};

const SortSelect: React.FC<SortSelectProps> = ({ popularOption, handlePopularChange }) => {
  return (
    <FormControl sx={{ width: 200 }}>
      <InputLabel id="popular-label">Books</InputLabel>
      <Select
        labelId="popular-label"
        value={popularOption}
        onChange={handlePopularChange}
        label="Books"
        sx={{ border: 'none', boxShadow: 'none' }}
        MenuProps={{ disableScrollLock: true }}
      >
        <MenuItem value="all"></MenuItem>
        <MenuItem value="alphabetical">Alphabetical (A-Z)</MenuItem>
        <MenuItem value="alphabeticalReverse">Alphabetical (Z-A)</MenuItem>
        <MenuItem value="highToLow">Price: High to Low</MenuItem>
        <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
        <MenuItem value="bestSellers">Best Sellers</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortSelect;
