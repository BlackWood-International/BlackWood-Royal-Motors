import Papa from 'papaparse';
import { RawVehicleData, Vehicle } from '../types';

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQI2I4YgnUYN0b8Oa23uHLlaj5ln8bzNuifrOSpR3OF9pIvs66XETTUItjChkA6kxpGBsGLlgr4Be2-/pub?gid=0&single=true&output=csv";

export const fetchCatalog = (): Promise<Vehicle[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<RawVehicleData>(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      // IMPORTANT : Cette ligne nettoie les titres des colonnes (enlève les espaces invisibles)
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        // DEBUG : Affiche dans la console les colonnes trouvées
        console.log("Colonnes détectées dans le CSV :", results.meta.fields);
        
        try {
          const vehicles: Vehicle[] = results.data.map((row, index) => {
            const priceStr = row['Prix Vente'] || '0';
            // Clean price string to number (remove $, spaces, commas, non-breaking spaces)
            const priceVal = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));

            // Get image from the specific column "URL img"
            const rawImageUrl = row['URL img'] || row['Image'] || row['image'] || row['URL Image'] || '';
            
            // NETTOYAGE URL : On enlève tout ce qui est après l'extension .png, .jpg, etc.
            // Cela corrige le problème des paramètres "?cb=..." de Fandom/Wiki qui bloquent l'image
            const imageUrl = rawImageUrl.replace(/(\.(?:png|jpg|jpeg|webp)).*$/i, '$1');

            // DEBUG : Si l'image est manquante, on affiche pourquoi dans la console
            if (!imageUrl && rawImageUrl) {
               console.warn(`Image nettoyée vide pour la ligne ${index + 2}. URL Originale:`, rawImageUrl);
            } else if (!rawImageUrl) {
               // console.warn(`Image manquante pour la voiture (Ligne ${index + 2}).`);
            }

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
              image: imageUrl || undefined,
              description: row['Description'] || "Un chef-d'œuvre d'ingénierie alliant performance d'exception et confort absolu. Contactez nos conseillers pour une présentation détaillée."
            };
          });
          
          // Filter out completely empty rows/bad data
          const cleanVehicles = vehicles.filter(v => 
            (v.brand !== 'Unknown Brand' || v.model !== 'Unknown Model') && v.category
          );
          
          console.log(`${cleanVehicles.length} véhicules chargés avec succès.`);
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
