import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthorFilter from '@/components/catalog/author-filters';

describe('AuthorFilter', () => {
  const authors = ['Alice', 'Bob', 'Alice'];
  let selectedAuthors: string[] = [];

  const setSelectedAuthors = jest.fn((updater: React.SetStateAction<string[]>) => {
    if (typeof updater === 'function') {
      selectedAuthors = updater(selectedAuthors);
    } else {
      selectedAuthors = updater;
    }
  });

  const reference = React.createRef<HTMLDivElement>();

  beforeEach(() => {
    selectedAuthors = [];
    jest.clearAllMocks();
  });

  it('renders authors uniquely with checkboxes', () => {
    render(
      <AuthorFilter
        authors={authors}
        selectedAuthors={selectedAuthors}
        setSelectedAuthors={setSelectedAuthors}
        authorsContainerReference={reference}
      />,
    );

    expect(screen.getByText('Authors')).toBeInTheDocument();

    expect(screen.getByLabelText('Alice')).toBeInTheDocument();
    expect(screen.getByLabelText('Bob')).toBeInTheDocument();

    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('calls setSelectedAuthors when checkbox is clicked', () => {
    render(
      <AuthorFilter
        authors={authors}
        selectedAuthors={selectedAuthors}
        setSelectedAuthors={setSelectedAuthors}
        authorsContainerReference={reference}
      />,
    );

    const aliceCheckbox = screen.getByLabelText('Alice');
    fireEvent.click(aliceCheckbox);

    expect(setSelectedAuthors).toHaveBeenCalled();
    expect(selectedAuthors).toContain('Alice');
  });
});
