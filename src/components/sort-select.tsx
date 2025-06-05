import { Select, MenuItem, FormControl } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

type SortSelectProps = {
  sortOption: string;
  handleSortChange: (event: SelectChangeEvent) => Promise<void>;
};

const SortSelect = ({ sortOption, handleSortChange }: SortSelectProps) => {
  return (
    <FormControl sx={{ width: 160 }}>
      <Select
        variant="standard"
        value={sortOption}
        onChange={(event) => void handleSortChange(event)}
        MenuProps={{ disableScrollLock: true }}
      >
        <MenuItem value="name.en asc">Sort by name (A-Z)</MenuItem>
        <MenuItem value="name.en desc">Sort by name (Z-A)</MenuItem>
        <MenuItem value="price asc">Price: Low to High</MenuItem>
        <MenuItem value="price desc">Price: High to Low</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortSelect;
