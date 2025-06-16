import { render, screen, fireEvent } from '@testing-library/react';
import SortSelect from '@/components/catalog/sort-select';
import type { SelectChangeEvent } from '@mui/material';

describe('SortSelect', () => {
  it('renders select and handles change correctly', () => {
    const mockHandleSortChange = jest.fn<Promise<void>, [SelectChangeEvent]>(() => Promise.resolve());

    render(<SortSelect sortOption="name.en asc" handleSortChange={mockHandleSortChange} />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveTextContent('Sort by name (A-Z)');

    fireEvent.mouseDown(combobox);

    const menuItem = screen.getByText('Price: Low to High');
    fireEvent.click(menuItem);

    expect(mockHandleSortChange).toHaveBeenCalledTimes(1);

    const [event] = mockHandleSortChange.mock.calls[0];
    expect('target' in event && 'value' in event.target).toBe(true);
    expect(event.target.value).toBe('price asc');
  });
});
