
import { BASE_URL, RATE_LIMIT_DELAY, delay } from './apiHelpers';

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
      
      const response = await fetch(pageUrl);
      
      if (!response.ok) {
        if (response.status === 429) {

          await delay(RATE_LIMIT_DELAY * 2);
          continue;
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: VoteringResponse = await response.json();
      
      if (!data.voteringlista?.votering) {

        break;
      }

      const voteringList = normalizeToArray(data.voteringlista.votering);
      
      if (voteringList.length === 0) {

        break;
      }

      allVoteringar.push(...voteringList);
      
      if (voteringList.length < 20) {

        break;
      }

      if (params.p) break;

      currentPage++;
      await delay(RATE_LIMIT_DELAY);
    }


    return allVoteringar;

  } catch (error) {
    console.error('Error fetching voteringar:', error);
    throw error;
  }
}

export async function hamtaVotering(voteringId: string): Promise<Votering | null> {
  try {
    const url = `${BASE_URL}/votering/?id=${voteringId}&utformat=json`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API request failed: ${response.status}`);
    }
    const data: VoteringResponse = await response.json();
    return data.voteringlista?.votering ? normalizeToArray(data.voteringlista.votering)[0] : null;
  } catch (error) {
    console.error('Error fetching votering:', error);
    throw error;
  }
}

