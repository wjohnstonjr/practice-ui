import { Box, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider, useColorScheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import AddressTable from '../features/addresses/AddressTable';
import CustomerTable from '../features/customers/CustomerTable';
import './App.css';

const theme = createTheme({
  colorSchemes: {
    light: true, // Uses default light palette
    dark: true,  // Uses default dark palette
  },
});

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
    </Button>
  );
}

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Tabs value={selectedTab} onChange={handleChange} >
        <Tab label="Addresses" />
        <Tab label="Customers" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && <AddressTable />}
        {selectedTab === 1 && <CustomerTable />}
      </Box>
    </ThemeProvider>
  );
};

export default App;
