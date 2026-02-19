
/**
 * Calcule la distance de Levenshtein entre deux chaînes.
 * Indique le nombre minimum de modifications (ajout, suppression, substitution)
 * pour transformer a en b.
 */
function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = new Array(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    let row = (matrix[i] = new Array(an + 1));
    row[0] = i;
  }
  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1], // substitution
          matrix[i][j - 1],     // insertion
          matrix[i - 1][j]      // deletion
        ) + 1;
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Recherche floue et exacte combinée (Tokenized).
 * Sépare la recherche par mots (tokens) pour gérer l'ordre "Marque Modèle" vs "Modèle Marque".
 * Priorise d'abord les correspondances strictes (tous les mots inclus).
 * Ne bascule sur la tolérance d'erreur (Levenshtein) que si aucun match exact n'est trouvé.
 */
export function fuzzySearch<T>(items: T[], query: string, keys: (keyof T)[], threshold: number = 0.5): T[] {
  if (!query || query.trim() === '') return items;
  
  const lowerQuery = query.toLowerCase().trim();
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 0);

  const strictMatches: { item: T, score: number }[] = [];
  const fuzzyMatches: { item: T, score: number }[] = [];

  for (const item of items) {
    // Combiner les champs pour la recherche globale
    const combinedValue = keys.map(k => String(item[k] || '')).join(' ').toLowerCase();

    // 1. MATCH STRICT : Vérifier si TOUS les mots tapés sont présents dans l'élément
    let allTermsMatch = true;
    for (const term of queryTerms) {
        if (!combinedValue.includes(term)) {
            allTermsMatch = false;
            break;
        }
    }

    if (allTermsMatch) {
        // Bonus pour récompenser les correspondances très précises
        let strictScore = 100;
        if (combinedValue.includes(lowerQuery)) strictScore += 50;
        // Moins l'élément contient de texte superflu, meilleur est le score (Deity > Deity Custom)
        strictScore -= combinedValue.length * 0.1; 
        
        strictMatches.push({ item, score: strictScore });
        continue; // Pas besoin de calculer le flou pour ce véhicule
    }

    // 2. MATCH FLOU : Moyenne de similarité pour chaque mot de la requête
    let totalFuzzyScore = 0;

    for (const term of queryTerms) {
        let bestTermSim = 0;
        
        for (const key of keys) {
            const value = String(item[key] || '').toLowerCase();
            
            // Compare avec la valeur complète du champ
            let dist = levenshtein(value, term);
            let maxLen = Math.max(value.length, term.length);
            let sim = 1 - (dist / maxLen);
            if (sim > bestTermSim) bestTermSim = sim;
            
            // Compare mot à mot dans la valeur (ex: "Deity" dans "Enus Deity")
            const valueWords = value.split(/\s+/);
            for (const vw of valueWords) {
                let wDist = levenshtein(vw, term);
                let wMaxLen = Math.max(vw.length, term.length);
                let wSim = 1 - (wDist / wMaxLen);
                if (wSim > bestTermSim) bestTermSim = wSim;
            }
        }
        totalFuzzyScore += bestTermSim;
    }

    const avgFuzzyScore = totalFuzzyScore / queryTerms.length;

    // Ajout si la moyenne de similarité dépasse le seuil
    if (avgFuzzyScore >= threshold) {
        fuzzyMatches.push({ item, score: avgFuzzyScore });
    }
  }

  // RÈGLE D'OR : S'il y a des correspondances exactes, on ignore totalement les correspondances floues.
  // Cela empêche "Enus Deity" d'afficher toutes les "Enus" juste parce que le mot Enus est commun.
  if (strictMatches.length > 0) {
     return strictMatches
        .sort((a, b) => b.score - a.score)
        .map(m => m.item);
  }

  // Sinon (faute de frappe), on affiche les résultats flous
  return fuzzyMatches
    .sort((a, b) => b.score - a.score)
    .map(m => m.item);
}
