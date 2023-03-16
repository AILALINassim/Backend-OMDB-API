import express from 'express';
//import bodyParser from 'body-parser';
import axios from 'axios';
import { google, sheets_v4 } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON body
app.use(express.json());

// Middleware for simple password authentication
app.use((req, res, next) => {
  const password = req.headers.authorization || '';
  if (password !== process.env.PASSWORD) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    next();
  }
});

// Middleware for parsing HTTP POST body
app.use(express.urlencoded({ extended: true }));

// Route for getting movie list from OMDB API
app.get('/get-fast-and-furious-movies', async (req, res) => {
  try {

    const response = await axios.get(`http://www.omdbapi.com/?S=fast&furious&apikey=${process.env.OMDB_API_KEY}`);
    let allMoviesData = [];

    await Promise.all(response.data.Search.map(async (element: any) => {
      const response = await axios.get(`http://www.omdbapi.com/?i=${element.imdbID}&apikey=${process.env.OMDB_API_KEY}`);
      let actorsInCommonWithStarWars = ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher', 'Daisy Ridley', 'John Boyega'].filter((actor: string) => response.data.Actors.includes(actor)).join(', ')
      allMoviesData.push({
        title: response.data.Title,
        year: response.data.Year,
        poster: response.data.Poster,
        director: response.data.Director,
        producedBefore2015: parseInt(response.data.Year) < 2015,
        hasPaulWalker: response.data.Actors.includes('Paul Walker'),
        actorsInCommonWithStarWars : actorsInCommonWithStarWars.length === 0 ? 'NO RELATED ACTOR' : actorsInCommonWithStarWars
      })
    }));

    res.json(allMoviesData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for getting Pirates of the Caribbean movies and storing them in a Google Sheet
app.get('/pirates-of-the-caribbean', async (req, res) => {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await axios.get(`http://www.omdbapi.com/?s=pirates%20of%20the%20caribbean&plot=full&apikey=${process.env.OMDB_API_KEY}`);
    let allMoviesData = [];

    await Promise.all(response.data.Search.map(async (element: any) => {

      const response = await axios.get(`http://www.omdbapi.com/?i=${element.imdbID}&apikey=${process.env.OMDB_API_KEY}`);
      let actorsInCommonWithStarWars = ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher', 'Daisy Ridley', 'John Boyega'].filter((actor: string) => response.data.Actors.includes(actor)).join(', ')
      
      allMoviesData.push({
        title: response.data.Title,
        year: response.data.Year,
        poster: response.data.Poster,
        director: response.data.Director,
        producedBefore2015: parseInt(response.data.Year) < 2015,
        hasPaulWalker: response.data.Actors.includes('Paul Walker'),
        actorsInCommonWithStarWars : actorsInCommonWithStarWars.length === 0 ? 'NO RELATED ACTOR' : actorsInCommonWithStarWars
      })

    }));

    const rows = allMoviesData.map((allMoviesData) => Object.values(allMoviesData));
    const params: sheets_v4.Params$Resource$Spreadsheets$Values$Append = {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: process.env.RANGE_NAME,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    };

    await sheets.spreadsheets.values.append(params);

    res.json({ message: 'Movies added to the spreadsheet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});