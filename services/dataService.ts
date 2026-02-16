import Papa from 'papaparse';
import { RawVehicleData, Vehicle } from '../types';

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQI2I4YgnUYN0b8Oa23uHLlaj5ln8bzNuifrOSpR3OF9pIvs66XETTUItjChkA6kxpGBsGLlgr4Be2-/pub?gid=0&single=true&output=csv";

export const fetchCatalog = (): Promise<Vehicle[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<RawVehicleData>(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const vehicles: Vehicle[] = results.data.map((row, index) => {
            const priceStr = row['Prix Vente'] || '0';
            // Clean price string to number (remove $, spaces, commas, non-breaking spaces)
            const priceVal = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));

            // Get image from the specific column "URL img" shown in screenshot, or fallbacks
            const imageUrl = row['URL img'] || row['Image'] || row['image'] || row['URL Image'] || undefined;

            // Format price with spaces as thousand separators and $ prefix
            // Example: 1000000 -> $ 1 000 000
            const formattedPrice = isNaN(priceVal) 
                ? "Sur Demande" 
                : `$ ${priceVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;

            return {
              id: `vehicle-${index}`,
              originalIndex: index, // Capture the row number for default sorting
              brand: row['Marque'] || 'Unknown Brand',
              model: row['Modèle'] || 'Unknown Model',
              category: row['Catégorie'] || 'Uncategorized',
              price: formattedPrice,
              priceValue: isNaN(priceVal) ? 0 : priceVal,
              image: imageUrl,
              description: row['Description'] || "Un chef-d'œuvre d'ingénierie alliant performance d'exception et confort absolu. Contactez nos conseillers pour une présentation détaillée."
            };
          });
          
          // Filter out completely empty rows/bad data
          const cleanVehicles = vehicles.filter(v => 
            (v.brand !== 'Unknown Brand' || v.model !== 'Unknown Model') && v.category
          );
          
          resolve(cleanVehicles);
        } catch (e) {
          reject(e);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};