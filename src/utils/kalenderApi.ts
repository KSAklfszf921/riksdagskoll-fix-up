import cheerio from 'cheerio';

const BASE_URL = 'https://data.riksdagen.se';
const RATE_LIMIT_DELAY = 400;

export interface KalenderHandelse {
  datum: string;
  typ: string;
  organ: string;
  rubrik: string;
  beskrivning: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function hamtaKalender(from: string, tom: string): Promise<KalenderHandelse[]> {
  const url = `${BASE_URL}/kalender/?from=${from}&tom=${tom}&utformat=html`;
  console.log(`Fetching kalender: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  const html = await response.text();
  await delay(RATE_LIMIT_DELAY);
  const $ = cheerio.load(html);
  const events: KalenderHandelse[] = [];
  $('tr').each((_, row) => {
    const cols = $(row).find('td');
    const datum = $(cols[0]).text().trim();
    const typ = $(cols[1]).text().trim();
    const organ = $(cols[2]).text().trim();
    const rubrik = $(cols[3]).text().trim();
    const beskrivning = $(cols[4]).text().trim();
    if (datum) {
      events.push({ datum, typ, organ, rubrik, beskrivning });
    }
  });
  return events;
}

