import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useSignals } from '@preact/signals-react/runtime';
import { searchQuery, setSearchQuery } from '@/store/signals';
import { debounce } from '@/utils/helpers';

const SearchBar: React.FC = () => {
  useSignals();
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(searchQuery.value);

  // Debounced search to avoid too many API calls
  const debouncedSearch = React.useMemo(
    () => debounce((value: string) => setSearchQuery(value), 300),
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setLocalValue('');
    setSearchQuery('');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search products, categories, SKUs..."
        value={localValue}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '10px 14px',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '1.2rem',
                }} 
              />
            </InputAdornment>
          ),
          endAdornment: localValue && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;