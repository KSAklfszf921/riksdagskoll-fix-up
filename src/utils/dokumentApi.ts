
import { BASE_URL, RATE_LIMIT_DELAY, delay } from './apiHelpers';

export interface DokumentParams {
  rm?: string; // riksmöte
  doktyp?: string; // dokumenttyp (mot, prop, bet, etc.)
  organ?: string; // utskott/organ
  from?: string; // datum från
  tom?: string; // datum till
  sok?: string; // fritextsökning
  p?: number; // sidnummer
}

export interface Dokument {
  dok_id: string;
  titel: string;
  doktyp: string;
  rm: string;
  datum: string;
  organ: string;
  status?: string;
  hangar_id?: string;
  relaterat_id?: string;
  dokument_url_text?: string;
  dokument_url_html?: string;
  dokument_url_pdf?: string;
}

export interface DokumentResponse {
  dokumentlista?: {
    dokument: Dokument | Dokument[];
  };
}

const normalizeToArray = <T>(data: T | T[]): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

export async function hamtaDokument(params: DokumentParams = {}): Promise<Dokument[]> {
  try {
    let url = `${BASE_URL}/dokumentlista/?utformat=json`;
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url += `&${key}=${encodeURIComponent(value.toString())}`;
      }
    });

    let currentPage = params.p || 1;
    const allDokument: Dokument[] = [];
    
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

      const data: DokumentResponse = await response.json();
      
      if (!data.dokumentlista?.dokument) {
        
        break;
      }

      const dokumentList = normalizeToArray(data.dokumentlista.dokument);
      
      if (dokumentList.length === 0) {
        
        break;
      }

      allDokument.push(...dokumentList);
      
      if (dokumentList.length < 20) {
        
        break;
      }

      if (params.p) break;

      currentPage++;
      await delay(RATE_LIMIT_DELAY);
    }

    
    return allDokument;

  } catch (error) {
    console.error('Error fetching dokument:', error);
    throw error;
  }
}

export async function hamtaDokumentById(dokId: string): Promise<Dokument | null> {
  try {
    const url = `${BASE_URL}/dokument/?dok_id=${dokId}&utformat=json`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API request failed: ${response.status}`);
    }
    const data: DokumentResponse = await response.json();
    return data.dokumentlista?.dokument ? normalizeToArray(data.dokumentlista.dokument)[0] : null;
  } catch (error) {
    console.error('Error fetching dokument:', error);
    throw error;
  }
}

