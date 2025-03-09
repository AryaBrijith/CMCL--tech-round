/**
 * UK Flood Monitoring Tool - Backend API (Node.js)
 */

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Environment Agency API endpoints
const API_BASE = 'https://environment.data.gov.uk/flood-monitoring';
const STATIONS_ENDPOINT = `${API_BASE}/id/stations`;
const READINGS_ENDPOINT = `${API_BASE}/id/stations`;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get stations
app.get('/api/stations', async (req, res) => {
    try {
        // Extract query parameters
        const limit = req.query.limit || 500;
        
        // Build the request URL
        const url = `${STATIONS_ENDPOINT}?_limit=${limit}`;
        
        // Make the request to the EA API
        console.log(`Fetching stations from: ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return the response data
        res.json(data);
    
    } catch (error) {
        console.error(`Error fetching stations: ${error.message}`);
        res.status(500).json({
            error: 'Failed to fetch stations from the Environment Agency API',
            details: error.message
        });
    }
});

// API endpoint to search stations by name, river, or location
app.get('/api/stations/search', async (req, res) => {
    try {
        // Extract query parameters
        const query = req.query.q || '';
        const limit = req.query.limit || 500;
        
        if (!query) {
            return res.status(400).json({
                error: "Search query is required"
            });
        }
        
        // First fetch all stations
        const url = `${STATIONS_ENDPOINT}?_limit=${limit}`;
        
        console.log(`Fetching stations for search from: ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
            return res.json({
                items: [],
                meta: { count: 0 }
            });
        }
        
        // Filter stations based on search query
        const lowercaseQuery = query.toLowerCase();
        const filteredStations = data.items.filter(station => {
            const name = ((station.label || station.name) || '').toLowerCase();
            const riverName = (station.riverName || '').toLowerCase();
            const town = (station.town || '').toLowerCase();
            
            return (
                name.includes(lowercaseQuery) || 
                riverName.includes(lowercaseQuery) || 
                town.includes(lowercaseQuery)
            );
        });
        
        // Return filtered results
        res.json({
            items: filteredStations,
            meta: { count: filteredStations.length }
        });
    
    } catch (error) {
        console.error(`Error searching stations: ${error.message}`);
        res.status(500).json({
            error: 'Failed to search stations',
            details: error.message
        });
    }
});

// API endpoint to get readings for a specific station
app.get('/api/stations/:stationId/readings', async (req, res) => {
    try {
        // Extract path and query parameters
        const { stationId } = req.params;
        const hours = req.query.hours || 24;
        
        // Calculate date based on hours
        const now = new Date();
        const since = new Date(now.getTime() - (hours * 60 * 60 * 1000));
        const sinceIso = since.toISOString();
        
        // Build the request URL
        const url = `${READINGS_ENDPOINT}/${stationId}/readings?since=${sinceIso}&_sorted=true`;
        
        // Make the request to the EA API
        console.log(`Fetching readings from: ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return the response data
        res.json(data);
    
    } catch (error) {
        console.error(`Error fetching readings for station ${req.params.stationId}: ${error.message}`);
        res.status(500).json({
            error: `Failed to fetch readings for station ${req.params.stationId}`,
            details: error.message
        });
    }
});

// Catch-all route to serve the main HTML file for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
});