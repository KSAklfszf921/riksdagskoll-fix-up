import cheerio from 'cheerio';
import { BASE_URL, RATE_LIMIT_DELAY, delay } from './apiHelpers';

export interface KalenderHandelse {
  datum: string;
  typ: string;
  organ: string;
  rubrik: string;
  beskrivning: string;
}


export async function hamtaKalender(from: string, tom: string): Promise<KalenderHandelse[]> {
  const url = `${BASE_URL}/kalender/?from=${from}&tom=${tom}&utformat=html`;
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

