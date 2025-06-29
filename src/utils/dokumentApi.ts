
const BASE_URL = 'https://data.riksdagen.se';
const RATE_LIMIT_DELAY = 400;

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      console.log(`Fetching dokument page ${currentPage}: ${pageUrl}`);
      
      const response = await fetch(pageUrl);
      
      if (!response.ok) {
        if (response.status === 429) {
          console.log('Rate limit hit, waiting...');
          await delay(RATE_LIMIT_DELAY * 2);
          continue;
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: DokumentResponse = await response.json();
      
      if (!data.dokumentlista?.dokument) {
        console.log('No more dokument found');
        break;
      }

      const dokumentList = normalizeToArray(data.dokumentlista.dokument);
      
      if (dokumentList.length === 0) {
        console.log('Empty results, stopping pagination');
        break;
      }

      allDokument.push(...dokumentList);
      
      if (dokumentList.length < 20) {
        console.log('Last page reached');
        break;
      }

      if (params.p) break;

      currentPage++;
      await delay(RATE_LIMIT_DELAY);
    }

    console.log(`Found ${allDokument.length} dokument total`);
    return allDokument;

  } catch (error) {
    console.error('Error fetching dokument:', error);
    throw error;
  }
}
