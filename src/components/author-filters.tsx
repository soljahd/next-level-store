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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ mt: 3, alignSelf: 'flex-start', marginLeft: 5 }}>
        Authors
      </Typography>
      <Box
        ref={authorsContainerReference}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 230,
          width: '100%',
          maxHeight: 300,
          overflowY: 'auto',
          pr: 1,
        }}
      >
        {uniqueAuthors.map((author, index) => (
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
    </Box>
  );
};

export default AuthorFilter;
