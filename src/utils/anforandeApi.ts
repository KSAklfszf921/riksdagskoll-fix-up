
import { BASE_URL, RATE_LIMIT_DELAY, delay } from './apiHelpers';

export interface AnforandeParams {
  rm?: string; // Riksmöte, t.ex. "2023/24"
  parti?: string; // Partibokstav
  kon?: string; // K eller M
  talare?: string; // Talarnamn
  iid?: string; // Intressent-id
  anforandetyp?: string;
  sok?: string; // Fritextsökning
  sort?: string; // Sortering
  p?: number; // Sidnummer
}

export interface Anforande {
  anforande_id: string;
  dok_datum: string;
  talare: string;
  parti: string;
  intressent_id: string;
  kon: string;
  anforandetyp: string;
  dok_titel: string;
  rubrik: string;
  anforande: string;
  protokoll_url_xml?: string;
  relaterat_dokument_url?: string;
  nummer?: string;
}

export interface AnforandeResponse {
  anforanden?: {
    anforande: Anforande | Anforande[];
  };
}



export async function sokAnforanden(params: AnforandeParams = {}): Promise<Anforande[]> {
  try {
    let url = `${BASE_URL}/anforandelista/?utformat=json`;
    
    // Add parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url += `&${key}=${encodeURIComponent(value.toString())}`;
      }
    });

    let currentPage = params.p || 1;
    const allAnforanden: Anforande[] = [];
    
    while (true) {
      const pageUrl = `${url}&p=${currentPage}`;
      
      const response = await fetch(pageUrl);
      
      if (!response.ok) {
        if (response.status === 429) {
          
          await delay(RATE_LIMIT_DELAY * 2);
          continue;
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: AnforandeResponse = await response.json();
      
      if (!data.anforanden?.anforande) {
        
        break;
      }

      let anforandenList = data.anforanden.anforande;
      
      // Handle both single object and array responses
      if (!Array.isArray(anforandenList)) {
        anforandenList = [anforandenList];
      }

      if (anforandenList.length === 0) {
        
        break;
      }

      allAnforanden.push(...anforandenList);
      
      // If we got fewer than expected results, we're likely on the last page
      if (anforandenList.length < 10) {
        
        break;
      }

      // If we only want one page, break here
      if (params.p) {
        break;
      }

      currentPage++;
      
      // Respect rate limit
      await delay(RATE_LIMIT_DELAY);
    }

    return allAnforanden;

  } catch (error) {
    console.error('Error fetching anföranden:', error);
    throw error;
  }
}

export async function hamtaAnforande(anforandeId: string): Promise<Anforande | null> {
  try {
    const url = `${BASE_URL}/anforande/?id=${anforandeId}&utformat=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.anforande || null;

  } catch (error) {
    console.error('Error fetching anförande:', error);
    throw error;
  }
}

// Get recent speeches for homepage
export async function getRecentAnforanden(limit: number = 5): Promise<Anforande[]> {
  const params: AnforandeParams = {
    sort: 'datum_desc',
    p: 1
  };
  
  const results = await sokAnforanden(params);
  return results.slice(0, limit);
}

// Search speeches by topic
export async function searchAnforandenByTopic(topic: string, limit: number = 10): Promise<Anforande[]> {
  const params: AnforandeParams = {
    sok: topic,
    sort: 'datum_desc',
    p: 1
  };
  
  const results = await sokAnforanden(params);
  return results.slice(0, limit);
}

// Get speeches by party
export async function getAnforandenByParty(parti: string, limit: number = 10): Promise<Anforande[]> {
  const params: AnforandeParams = {
    parti,
    sort: 'datum_desc',
    p: 1
  };
  
  const results = await sokAnforanden(params);
  return results.slice(0, limit);
}

export async function hamtaRecentaAnforanden(limit: number = 10): Promise<Anforande[]> {
  return getRecentAnforanden(limit);
}

export async function hamtaAnforandenForPerson(intressentId: string): Promise<Anforande[]> {
  return sokAnforanden({ iid: intressentId });
}

