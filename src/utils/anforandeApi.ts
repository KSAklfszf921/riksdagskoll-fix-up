
const BASE_URL = 'https://data.riksdagen.se';
const RATE_LIMIT_DELAY = 400;

export interface AnforandeParams {
  rm?: string; // riksmöte, ex "2024/25"
  sok?: string; // fritextsökning
  parti?: string; // partibokstav
  talare?: string; // namn på talare
  anforandetyp?: string; // typ av anförande
  intressent_id?: string; // person-id
  from?: string; // datum från
  tom?: string; // datum till
  p?: number; // sidnummer
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
  anforandelista?: {
    anforande: Anforande | Anforande[];
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeToArray = <T>(data: T | T[]): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

export async function hamtaAnforanden(params: AnforandeParams = {}): Promise<Anforande[]> {
  try {
    let url = `${BASE_URL}/anforandelista/?utformat=json`;
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url += `&${key}=${encodeURIComponent(value.toString())}`;
      }
    });

    let currentPage = params.p || 1;
    const allAnforanden: Anforande[] = [];
    
    while (true) {
      const pageUrl = `${url}&p=${currentPage}`;
      console.log(`Fetching anföranden page ${currentPage}: ${pageUrl}`);
      
      const response = await fetch(pageUrl);
      
      if (!response.ok) {
        if (response.status === 429) {
          console.log('Rate limit hit, waiting...');
          await delay(RATE_LIMIT_DELAY * 2);
          continue;
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: AnforandeResponse = await response.json();
      
      if (!data.anforandelista?.anforande) {
        console.log('No more anföranden found');
        break;
      }

      const anforandeList = normalizeToArray(data.anforandelista.anforande);
      
      if (anforandeList.length === 0) {
        console.log('Empty results, stopping pagination');
        break;
      }

      allAnforanden.push(...anforandeList);
      
      if (anforandeList.length < 20) {
        console.log('Last page reached');
        break;
      }

      if (params.p) break;

      currentPage++;
      await delay(RATE_LIMIT_DELAY);
    }

    console.log(`Found ${allAnforanden.length} anföranden total`);
    return allAnforanden;

  } catch (error) {
    console.error('Error fetching anföranden:', error);
    throw error;
  }
}

export async function hamtaRecentaAnforanden(limit: number = 10): Promise<Anforande[]> {
  return await hamtaAnforanden({ p: 1 });
}

export async function hamtaAnforandenForPerson(intressentId: string): Promise<Anforande[]> {
  return await hamtaAnforanden({ intressent_id: intressentId });
}
