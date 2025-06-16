import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material';

type AuthorFilterProps = {
  authors: string[];
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
  authorsContainerReference: React.RefObject<HTMLDivElement | null>;
};

const AuthorFilter: React.FC<AuthorFilterProps> = ({
  authors,
  selectedAuthors,
  setSelectedAuthors,
  authorsContainerReference,
}) => {
  const uniqueAuthors = [...new Set(authors)];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 230, width: '100%' }}>
      <Typography variant="h6" sx={{ alignSelf: 'flex-start' }}>
        Authors
      </Typography>
      <Box
        ref={authorsContainerReference}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 230,
          width: '100%',
          maxHeight: 300,
          overflowY: 'auto',
          pl: 2,
        }}
      >
        {uniqueAuthors.map((author, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                size="small"
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
    </Box>
  );
};

export default AuthorFilter;
