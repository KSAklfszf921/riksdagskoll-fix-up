
const BASE_URL = 'https://data.riksdagen.se';
const RATE_LIMIT_DELAY = 400;

export interface VoteringParams {
  rm?: string; // riksmöte
  bet?: string; // betänkande
  votering_id?: string; // specifik votering
  p?: number; // sidnummer
}

export interface Votering {
  votering_id: string;
  dok_id: string;
  intressent_id: string;
  namn: string;
  parti: string;
  valkrets: string;
  rost: string;
  avser: string;
  votering_datum: string;
}

export interface VoteringResponse {
  voteringlista?: {
    votering: Votering | Votering[];
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeToArray = <T>(data: T | T[]): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

export async function hamtaVoteringar(params: VoteringParams = {}): Promise<Votering[]> {
  try {
    let url = `${BASE_URL}/voteringlista/?utformat=json`;
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url += `&${key}=${encodeURIComponent(value.toString())}`;
      }
    });

    let currentPage = params.p || 1;
    const allVoteringar: Votering[] = [];
    
    while (true) {
      const pageUrl = `${url}&p=${currentPage}`;
      console.log(`Fetching voteringar page ${currentPage}: ${pageUrl}`);
      
      const response = await fetch(pageUrl);
      
      if (!response.ok) {
        if (response.status === 429) {
          console.log('Rate limit hit, waiting...');
          await delay(RATE_LIMIT_DELAY * 2);
          continue;
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: VoteringResponse = await response.json();
      
      if (!data.voteringlista?.votering) {
        console.log('No more voteringar found');
        break;
      }

      const voteringList = normalizeToArray(data.voteringlista.votering);
      
      if (voteringList.length === 0) {
        console.log('Empty results, stopping pagination');
        break;
      }

      allVoteringar.push(...voteringList);
      
      if (voteringList.length < 20) {
        console.log('Last page reached');
        break;
      }

      if (params.p) break;

      currentPage++;
      await delay(RATE_LIMIT_DELAY);
    }

    console.log(`Found ${allVoteringar.length} voteringar total`);
    return allVoteringar;

  } catch (error) {
    console.error('Error fetching voteringar:', error);
    throw error;
  }
}
