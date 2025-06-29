
import { BASE_URL, RATE_LIMIT_DELAY, delay } from './apiHelpers';

export interface PersonParams {
  kategori?: string; // nuvarande, tidigare, statsrad
  sok?: string; // fritextsökning
  parti?: string; // partibokstav
  valkrets?: string;
  kon?: string; // K eller M
  p?: number; // sidnummer
}

export interface Person {
  intressent_id: string;
  tilltalsnamn: string;
  efternamn: string;
  parti: string;
  valkrets: string;
  kon: string;
  fodd_ar: string;
  status: string;
  bild_url_80?: string;
  bild_url_192?: string;
  webbplats_url?: string;
  personuppgift_url_xml?: string;
}

export interface PersonDetailed extends Person {
  mandatperioder?: {
    mandatperiod: Array<{ period: string }> | { period: string };
  };
  uppdrag?: {
    uppdrag: Array<{
      typ: string;
      organ: string;
      roll: string;
      status: string;
      from?: string;
      tom?: string;
    }> | {
      typ: string;
      organ: string;
      roll: string;
      status: string;
      from?: string;
      tom?: string;
    };
  };
  kontaktuppgifter?: {
    kontaktuppgift: Array<{
      typ: string;
      uppgift: string;
    }> | {
      typ: string;
      uppgift: string;
    };
  };
}

export interface PersonResponse {
  personlista?: {
    person: Person | Person[];
  };
}


// Normalize array/object responses
const normalizeToArray = <T>(data: T | T[]): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

export async function sokPersoner(params: PersonParams = {}): Promise<Person[]> {
  try {
    let url = `${BASE_URL}/personlista/?utformat=json`;
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url += `&${key}=${encodeURIComponent(value.toString())}`;
      }
    });

    let currentPage = params.p || 1;
    const allPersons: Person[] = [];
    
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

      const data: PersonResponse = await response.json();
      
      if (!data.personlista?.person) {

        break;
      }

      const personList = normalizeToArray(data.personlista.person);
      
      if (personList.length === 0) {

        break;
      }

      allPersons.push(...personList);
      
      // If we got fewer than expected results, we're likely on the last page
      if (personList.length < 20) {

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


    return allPersons;

  } catch (error) {
    console.error('Error fetching persons:', error);
    throw error;
  }
}

export async function hamtaPerson(intressentId: string): Promise<PersonDetailed | null> {
  try {
    const url = `${BASE_URL}/person/?iid=${intressentId}&utformat=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.person || null;

  } catch (error) {
    console.error('Error fetching person:', error);
    throw error;
  }
}

// Get current members
export async function getCurrentMembers(): Promise<Person[]> {
  return await sokPersoner({ kategori: 'nuvarande' });
}

// Get former members
export async function getFormerMembers(): Promise<Person[]> {
  return await sokPersoner({ kategori: 'tidigare' });
}

// Get members by party
export async function getMembersByParty(parti: string): Promise<Person[]> {
  return await sokPersoner({ parti, kategori: 'nuvarande' });
}
