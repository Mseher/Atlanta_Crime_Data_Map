
# Crime Data Visualization React App

This is a React application for visualizing crime data in Atlanta using the Leaflet library. The application fetches data from the Atlanta crime data website in GeoJSON format and displays it on an interactive map.

## Features

- Fetches and displays crime data from the Atlanta crime data API.
- Visualizes specific types of crimes: Motor Vehicle Theft, Theft From Motor Vehicle, and Theft of Motor Vehicle Parts or Accessories.
- Allows filtering data based on date ranges: Today, Last Week, Last Month, and Last 3 Months.
- Uses a minimalistic base map from CartoDB Positron for better clarity.
- Interactive map with popups showing details of each crime incident.

## Live Demo

You can view a live demo of the application [here](https://atlantacrimedata.netlify.app).

## Prerequisites

Make sure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later) or yarn (v1 or later)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Mseher/Atlanta_Crime_Data_Map.git
   cd crime-data-visualization
   ```

2. **Install dependencies:**
   Using npm:
   ```sh
   npm install
   ```
   Or using yarn:
   ```sh
   yarn install
   ```

3. **Start the development server:**
   Using npm:
   ```sh
   npm start
   ```
   Or using yarn:
   ```sh
   yarn start
   ```

   The application will run on `http://localhost:3000`.

## Data Source

The crime data is fetched from the Atlanta crime data API in GeoJSON format. The data is sourced from the [Atlanta Police Department Open Data](https://opendata.atlantapd.org). The API is paginated to ensure that all updated data can be fetched efficiently.

API endpoint: `https://services3.arcgis.com/Et5Qfajgiyosiw4d/arcgis/rest/services/CrimeDataExport_2_view/FeatureServer/1/query`

## Pagination

The application handles paginated data fetching to ensure all updated data can be retrieved. The data is fetched in batches to overcome the limitation of 2000 records per request.

## Project Structure

```
crime-data-visualization/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   └── Map.js
         └── map.css
│   ├── App.js
│   ├── index.js
│   |
│   └── ...
├── .gitignore
├── package.json
├── README.md
└── ...
```

- **`src/components/AtlantaMap.js`**: Main component that renders the map and handles data fetching and filtering.
- **`src/map.css`**: Styles for the map and its controls.
- **`public/index.html`**: The HTML file that contains the root div for the React app.
- **`src/App.js`**: Main application component.
- **`src/index.js`**: Entry point for the React application.

## Deployment

To deploy the application, you can use any static site hosting service such as GitHub Pages, Vercel, Netlify, etc.

1. **Build the application:**
   Using npm:
   ```sh
   npm run build
   ```
   Or using yarn:
   ```sh
   yarn build
   ```

2. **Deploy the `build/` directory to your hosting service.**

For detailed instructions on deploying React applications, refer to the [Create React App deployment documentation](https://create-react-app.dev/docs/deployment/).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgements

- [React](https://reactjs.org/)
- [Leaflet](https://leafletjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Atlanta Police Department Open Data](https://opendata.atlantapd.org)
- [CartoDB](https://carto.com/)


