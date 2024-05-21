import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Row, Col } from "react-bootstrap";
import "./map.css";

const AtlantaMap = () => {
  const [map, setMap] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("Today");

  const nibrsCodeNames = ["Motor Vehicle Theft", "Theft From Motor Vehicle", "Theft of Motor Vehicle Parts or Accessories"];
  const batchSize = 2000; // Adjust the batch size as needed
  
  const getTimeRange = (filter) => {
    const now = new Date();
    let startTime;
    switch (filter) {
      case "Today":
        startTime = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        break;
      case "Week":
        startTime = new Date(now.setDate(now.getDate() - 7)).toISOString();
        break;
      case "Month":
        startTime = new Date(now.setDate(now.getDate() - 30)).toISOString();
        break;
      case "3 Months":
        startTime = new Date(now.setDate(now.getDate() - 90)).toISOString();
        break;
      default:
        startTime = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    }
    return startTime;
  };

  useEffect(() => {
    const fetchCrimeData = async (filter) => {
      const startTime = getTimeRange(filter);
      const endTime = new Date().toISOString();
      
      const whereClause = nibrsCodeNames.map(codeName => `nibrs_code_name='${codeName}'`).join(' OR ');

      let allFeatures = [];
      let offset = 0;
      let hasMoreData = true;

      while (hasMoreData) {
        try {
          const response = await fetch(
            `https://services3.arcgis.com/Et5Qfajgiyosiw4d/arcgis/rest/services/CrimeDataExport_2_view/FeatureServer/1/query?where=(${whereClause}) AND report_Date >= '${startTime}' AND report_Date <= '${endTime}'&outFields=*&returnGeometry=true&orderByFields=OBJECTID&resultOffset=${offset}&resultRecordCount=${batchSize}&f=pgeojson`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            allFeatures = [...allFeatures, ...data.features];
            offset += batchSize;
          } else {
            hasMoreData = false;
          }
        } catch (error) {
          console.error("Error fetching crime data:", error);
          hasMoreData = false;
        }
      }
      setFilteredData(allFeatures);
    };

    fetchCrimeData(filter);
  }, [filter]);

  useEffect(() => {
    const mapInstance = L.map("map").setView([33.7490, -84.3880], 12); // Centering the map on Atlanta with a zoom level of 12

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    // Add legend
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");
      const categories = ["Motor Vehicle Theft", "Theft From Motor Vehicle", "Theft of Motor Vehicle Parts or Accessories"];
      const colors = ["red", "black", "blue"];

      let legendHtml = "";
      for (let i = 0; i < categories.length; i++) {
        legendHtml +=
          '<div class="legend-item"><i class="fas fa-map-marker-alt" style="color:' +
          colors[i] +
          '"></i> ' +
          categories[i] +
          "</div>";
      }
      div.innerHTML = legendHtml;
      return div;
    };

    legend.addTo(mapInstance);

    const filterControl = L.control({ position: "topright" });

    filterControl.onAdd = function (map) {
      const div = L.DomUtil.create("div", "filter-control");
      div.innerHTML = `
        <form>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="filter" id="filterToday" value="Today" ${filter === "Today" ? "checked" : ""}>
            <label class="form-check-label" for="filterToday">Today</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="filter" id="filterWeek" value="Week" ${filter === "Week" ? "checked" : ""}>
            <label class="form-check-label" for="filterWeek">Last Week</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="filter" id="filterMonth" value="Month" ${filter === "Month" ? "checked" : ""}>
            <label class="form-check-label" for="filterMonth">Last Month</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="filter" id="filter3Months" value="3 Months" ${filter === "3 Months" ? "checked" : ""}>
            <label class="form-check-label" for="filter3Months">Last 3 Months</label>
          </div>
        </form>
      `;
      L.DomEvent.on(div, 'change', (e) => {
        setFilter(e.target.value);
      });
      return div;
    };

    filterControl.addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      // Clean up
      mapInstance.remove();
    };
  }, [filter]);

  useEffect(() => {
    if (map && filteredData.length > 0) {
      console.log("Rendering Markers:", filteredData); // Debug log for filtered data to be rendered

      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });

      // Add new markers
      const crimeLayer = L.geoJSON({ type: "FeatureCollection", features: filteredData }, {
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            const popupContent = `
              <strong>Location:</strong> ${feature.properties.location}
            `;
            layer.bindPopup(popupContent);
          }
        },
        pointToLayer: (feature, latlng) => {
          let iconHtml;
          switch (feature.properties.nibrs_code_name) {
            case "Motor Vehicle Theft":
              iconHtml = '<i class="fas fa-map-marker-alt" style="color: red; font-size: 1rem;"></i>';
              break;
            case "Theft From Motor Vehicle":
              iconHtml = '<i class="fas fa-map-marker-alt" style="color: black; font-size: 1rem;"></i>';
              break;
            case "Theft of Motor Vehicle Parts or Accessories":
              iconHtml = '<i class="fas fa-map-marker-alt" style="color: blue; font-size: 1rem;"></i>';
              break;
            default:
              iconHtml = '<i class="fas fa-question-circle" style="color: blue; font-size: 1rem;"></i>';
          }

          const icon = L.divIcon({
            html: iconHtml,
            className: "custom-icon",
            iconSize: [30, 30], // Adjust size if needed
          });

          return L.marker(latlng, { icon: icon });
        },
      }).addTo(map);

      return () => {
        map.removeLayer(crimeLayer);
      };
    }
  }, [map, filteredData]);

  return (
    <Row>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Col xs={12} md={9} style={{ width: "90%" }}>
          <div className="map-container">
            <div id="map" style={{ width: "100%", height: "100vh" }}></div>
          </div>
        </Col>
      </div>
    </Row>
  );
};

export default AtlantaMap;
