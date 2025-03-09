# UK Flood Monitoring Tool

A tool to visualize data from the UK Environment Agency's Real-Time Flood Monitoring API. This application allows users to select a measurement station and view its readings over the last 24 hours in both graphical and tabular formats.

## Features

- Station selection with search functionality
- Line graph visualization of readings over 24 hours
- Tabular data display
- Station details information
- Simple, clean user interface

## Project Structure

```
flood-monitoring-tool/
├── public/
│   └── index.html       # The main HTML interface
├── server.js            # Node.js backend server
```

## Setup Instructions

You can choose between a Node.js or Python backend implementation.

### Node.js Backend

#### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

#### Installation

1. Install the required dependencies:
   ```
   npm install express node-fetch
   ```

2. Create a folder called `public` and save the HTML file (`index.html`) inside it.

3. Save the Node.js backend file as `server.js` in your project root.

4. Start the server:
   ```
   node server.js
   ```

5. Access the application at [http://localhost:3000](http://localhost:3000)


## Backend API Endpoints

The backend server provides the following API endpoints:

- `GET /api/stations` - Get a list of all monitoring stations
- `GET /api/stations/search?q=<search-term>` - Search stations by name, river, or location
- `GET /api/stations/:stationId/readings` - Get readings for a specific station over the last 24 hours

## Technical Task Requirements

This implementation meets all the requirements specified in the technical task:

- Provides controls to select an individual measurement station ✓
- Shows a line graph with associated table of station readings over the last 24 hours ✓
- Created with user experience in mind ✓
- Follows professional software development standards ✓

## Customization

You can customize the application by:

1. Modifying the UI in `index.html`
2. Adjusting the time range for readings by changing the `hours` parameter in the backend
3. Adding additional features such as data export or multiple station comparison

## Notes

- The Environment Agency's API has rate limits, so excessive requests may be throttled
- The application is responsive and works on both desktop and mobile devices
- Error handling is implemented for API failures and data issues