import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Button, Select, MenuItem, Typography, Card, CardContent, CardMedia, CssBaseline } from '@mui/material';
import { Container } from '@mui/material';

// Custom dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',  // Light blue for primary
    },
    secondary: {
      main: '#f48fb1',  // Light pink for secondary
    },
    background: {
      default: '#121212',  // Dark background color
      paper: '#1e1e1e',    // Slightly lighter dark background for cards, inputs, etc.
    },
    text: {
      primary: '#ffffff',  // White text
    },
  },
});

const NewsApp = () => {
  const [news, setNews] = useState([]);           // Stores the fetched news articles
  const [country, setCountry] = useState('us');   // Default country: US
  const [query, setQuery] = useState('');         // Stores the search query input
  const [loading, setLoading] = useState(false);  // Loading state while fetching data
  const [error, setError] = useState('');         // Error state to show if there's an API issue

  // Function to fetch news articles from NewsAPI
  const fetchNews = async () => {
    setLoading(true);  // Start loading when the API call begins
    const API_KEY = '400aad2f835242aaa503a2a781b221ae'; // Replace this with your actual NewsAPI key
    let url;

    // Construct API URL based on whether a query exists or not
    if (query) {
      // Search query specified: Fetch based on search term
      url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
    } else {
      // No search query: Fetch top headlines from the selected country
      url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}`;
    }

    try {
      const response = await axios.get(url);
      // Check if there are no articles returned
      if (response.data.articles.length === 0) {
        // Fallback to global news if no articles are found for the selected country
        const fallbackUrl = `https://newsapi.org/v2/everything?q=latest&apiKey=${API_KEY}`;
        const fallbackResponse = await axios.get(fallbackUrl);
        setNews(fallbackResponse.data.articles);  // Update the news state with global articles
        setError(`No news found for the selected country (${country}). Showing global news.`);
      } else {
        setNews(response.data.articles);  // Update the news state with the fetched articles
        setError('');                     // Clear any existing errors
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to load news. Please try again.");
    }
    
    setLoading(false);  // End loading when the API call finishes
  };

  // Fetch the default news every time the country or search query changes
  useEffect(() => {
    fetchNews();
  }, [country]);  // Fetches the latest news whenever the country changes

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Ensures dark mode is applied to the whole app */}
      <Container style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Global News Aggregator
        </Typography>

        {/* Search and Country Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          {/* Search Bar */}
          <TextField
            label="Search News"
            value={query}
            onChange={(e) => setQuery(e.target.value)}   // Update search query
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={fetchNews}>
            Search
          </Button>

          {/* Country Selector */}
          <Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}   // Update the selected country
            variant="outlined"
          >
            {/* Country Options */}
            <MenuItem value="us">United States</MenuItem>
            <MenuItem value="in">India</MenuItem>
            <MenuItem value="gb">United Kingdom</MenuItem>
            <MenuItem value="au">Australia</MenuItem>
            <MenuItem value="ca">Canada</MenuItem>
            <MenuItem value="jp">Japan</MenuItem>
            <MenuItem value="fr">France</MenuItem>
            <MenuItem value="de">Germany</MenuItem>
            <MenuItem value="ru">Russia</MenuItem>
            <MenuItem value="br">Brazil</MenuItem>
            <MenuItem value="za">South Africa</MenuItem>
            <MenuItem value="ng">Nigeria</MenuItem>
            <MenuItem value="kr">South Korea</MenuItem>
            <MenuItem value="cn">China</MenuItem>
            <MenuItem value="ar">Argentina</MenuItem>
            {/* Add more countries as needed */}
          </Select>
        </div>

        {/* Loading Spinner */}
        {loading && <Typography variant="h6">Loading news...</Typography>}

        {/* Display Error if API call fails or no news for country */}
        {error && <Typography variant="h6" color="error">{error}</Typography>}

        {/* Display News Articles */}
        {!loading && news.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {news.map((article, index) => (
              <Card key={index} style={{ maxWidth: '300px', backgroundColor: darkTheme.palette.background.paper }}>
                {/* News Image */}
                {article.urlToImage && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={article.urlToImage}
                    alt={article.title}
                  />
                )}
                {/* News Content */}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {article.description || 'No description available.'}
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: '10px' }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No news found */}
        {!loading && news.length === 0 && !error && (
          <Typography variant="h6">No news articles found.</Typography>
        )}

        {/* Footer with Copyright */}
        <footer style={{ marginTop: '40px', padding: '10px', textAlign: 'center', color: '#90caf9' }}>
          <Typography variant="body2" color="textSecondary">
            © 2024 Tapaswi Shende. All Rights Reserved.
          </Typography>
        </footer>
      </Container>
    </ThemeProvider>
  );
};

export default NewsApp;
