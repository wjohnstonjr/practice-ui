import { Box, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider, useColorScheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Addresses from './Addresses';
import './App.css';
import Customers from './CustomerTable';

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
  const [addresses, setAddresses] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    fetch('http://localhost:8080/address')
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModeToggle />
      <Tabs value={selectedTab} onChange={handleChange} >
        <Tab label="Customers" />
        <Tab label="Addresses" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && <Customers addresses={addresses} />}
        {selectedTab === 1 && <Addresses rows={addresses} setRows={setAddresses} />}
      </Box>
    </ThemeProvider>
  );
};

export default App;
