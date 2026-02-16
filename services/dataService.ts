import Papa from 'papaparse';
import { RawVehicleData, Vehicle } from '../types';

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQI2I4YgnUYN0b8Oa23uHLlaj5ln8bzNuifrOSpR3OF9pIvs66XETTUItjChkA6kxpGBsGLlgr4Be2-/pub?gid=0&single=true&output=csv";

export const fetchCatalog = (): Promise<Vehicle[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<RawVehicleData>(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        try {
          const vehicles: Vehicle[] = results.data.map((row, index) => {
            const priceStr = row['Prix Vente'] || '0';
            const priceVal = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));

            const rawImageUrl = row['URL img'] || row['Image'] || row['image'] || row['URL Image'] || '';
            const imageUrl = rawImageUrl.replace(/(\.(?:png|jpg|jpeg|webp)).*$/i, '$1');

            const formattedPrice = isNaN(priceVal) 
                ? "Sur Demande" 
                : `$ ${priceVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;

            return {
              id: `vehicle-${index}`,
              originalIndex: index,
              brand: row['Marque'] || 'Unknown Brand',
              model: row['Modèle'] || 'Unknown Model',
              category: row['Catégorie'] || 'Uncategorized',
              price: formattedPrice,
              priceValue: isNaN(priceVal) ? 0 : priceVal,
              image: imageUrl || undefined,
              description: row['Description'] || "Un chef-d'œuvre d'ingénierie alliant performance d'exception et confort absolu. Contactez nos conseillers pour une présentation détaillée.",
              badge: row['Badge'] ? row['Badge'].trim() : undefined // Récupération du badge
            };
          });
          
          const cleanVehicles = vehicles.filter(v => 
            (v.brand !== 'Unknown Brand' || v.model !== 'Unknown Model') && v.category
          );
          
          resolve(cleanVehicles);
        } catch (e) {
          console.error("Erreur lors du traitement des données :", e);
          reject(e);
        }
      },
      error: (error) => {
        console.error("Erreur de téléchargement du CSV :", error);
        reject(error);
      }
    });
  });
};
