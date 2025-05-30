import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';

type AuthorFilterProps = {
  authors: string[];
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
  authorsToShowCount: number;
  setAuthorsToShowCount: React.Dispatch<React.SetStateAction<number>>;
  authorsContainerReference: React.RefObject<HTMLDivElement | null>;
};

const AuthorFilter: React.FC<AuthorFilterProps> = ({
  authors,
  selectedAuthors,
  setSelectedAuthors,
  authorsToShowCount,
  setAuthorsToShowCount,
  authorsContainerReference,
}) => {
  const uniqueAuthors = [...new Set(authors)];
  const visibleAuthors = uniqueAuthors.slice(0, authorsToShowCount);
  const allAuthorsShown = authorsToShowCount >= uniqueAuthors.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ mt: 3, alignSelf: 'flex-start', marginLeft: 5 }}>
        Authors
      </Typography>
      <Box
        ref={authorsContainerReference}
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 230, width: '100%' }}
      >
        {visibleAuthors.map((author, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selectedAuthors.includes(author)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setSelectedAuthors((previous) =>
                    checked ? [...previous, author] : previous.filter((a) => a !== author),
                  );
                }}
              />
            }
            label={author}
          />
        ))}
      </Box>

      {uniqueAuthors.length > 6 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <IconButton
            aria-label={allAuthorsShown ? 'Hide authors' : 'Show more authors'}
            onClick={() => {
              if (allAuthorsShown) {
                setAuthorsToShowCount(6);
                if (authorsContainerReference.current) {
                  authorsContainerReference.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              } else {
                setAuthorsToShowCount((count) => count + 6);
              }
            }}
            size="small"
          >
            {allAuthorsShown ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default AuthorFilter;
