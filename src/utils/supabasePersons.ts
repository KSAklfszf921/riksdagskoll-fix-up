
import { supabase } from '@/integrations/supabase/client';
import { PersonDetailed } from './personApi';

export interface LedamotRow {
  iid: string;
  tilltalsnamn?: string;
  efternamn?: string;
  parti?: string;
  valkrets?: string;
  kon?: string;
  fodd_ar?: number;
  status?: string;
  bild_url_80?: string;
  bild_url_192?: string;
  webbplats_url?: string;
  biografi_xml_url?: string;
}

export async function sparaLedamot(person: PersonDetailed): Promise<boolean> {
  try {
    // Spara huvuddata för ledamot
    const ledamotData: LedamotRow = {
      iid: person.intressent_id,
      tilltalsnamn: person.tilltalsnamn,
      efternamn: person.efternamn,
      parti: person.parti,
      valkrets: person.valkrets,
      kon: person.kon,
      fodd_ar: person.fodd_ar ? parseInt(person.fodd_ar) : null,
      status: person.status,
      bild_url_80: person.bild_url_80,
      bild_url_192: person.bild_url_192,
      webbplats_url: person.webbplats_url,
      biografi_xml_url: person.personuppgift_url_xml,
    };

    const { error: ledamotError } = await supabase
      .from('ledamoter')
      .upsert(ledamotData, { onConflict: 'iid' });

    if (ledamotError) {
      console.error('Error saving ledamot:', ledamotError);
      return false;
    }

    // Spara mandatperioder
    if (person.mandatperioder) {
      const mandatperioder = Array.isArray(person.mandatperioder.mandatperiod) 
        ? person.mandatperioder.mandatperiod 
        : [person.mandatperioder.mandatperiod];

      for (const period of mandatperioder) {
        const { error } = await supabase
          .from('mandatperioder')
          .upsert({
            iid: person.intressent_id,
            period: period.period
          }, { onConflict: 'iid,period' });

        if (error) {
          console.error('Error saving mandatperiod:', error);
        }
      }
    }

    // Spara uppdrag
    if (person.uppdrag) {
      const uppdragList = Array.isArray(person.uppdrag.uppdrag) 
        ? person.uppdrag.uppdrag 
        : [person.uppdrag.uppdrag];

      for (const uppdragItem of uppdragList) {
        const { error } = await supabase
          .from('uppdrag')
          .upsert({
            iid: person.intressent_id,
            typ: uppdragItem.typ,
            organ: uppdragItem.organ,
            roll: uppdragItem.roll,
            status: uppdragItem.status,
            from_date: uppdragItem.from || null,
            tom_date: uppdragItem.tom || null
          });

        if (error) {
          console.error('Error saving uppdrag:', error);
        }
      }
    }

    // Spara kontaktuppgifter
    if (person.kontaktuppgifter) {
      const kontaktList = Array.isArray(person.kontaktuppgifter.kontaktuppgift) 
        ? person.kontaktuppgifter.kontaktuppgift 
        : [person.kontaktuppgifter.kontaktuppgift];

      for (const kontakt of kontaktList) {
        const { error } = await supabase
          .from('kontaktuppgifter')
          .upsert({
            iid: person.intressent_id,
            typ: kontakt.typ,
            uppgift: kontakt.uppgift
          });

        if (error) {
          console.error('Error saving kontaktuppgift:', error);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error in sparaLedamot:', error);
    return false;
  }
}

export async function hamtaLedamoter() {
  const { data, error } = await supabase
    .from('ledamoter')
    .select('*')
    .order('efternamn');

  if (error) {
    console.error('Error fetching ledamoter:', error);
    return [];
  }

  return data || [];
}

export async function hamtaLedamotMedDetaljer(iid: string) {
  const { data: ledamot, error: ledamotError } = await supabase
    .from('ledamoter')
    .select('*')
    .eq('iid', iid)
    .single();

  if (ledamotError) {
    console.error('Error fetching ledamot:', ledamotError);
    return null;
  }

  const { data: mandatperioder } = await supabase
    .from('mandatperioder')
    .select('*')
    .eq('iid', iid);

  const { data: uppdrag } = await supabase
    .from('uppdrag')
    .select('*')
    .eq('iid', iid);

  const { data: kontakt } = await supabase
    .from('kontaktuppgifter')
    .select('*')
    .eq('iid', iid);

  return {
    ...ledamot,
    mandatperioder: mandatperioder || [],
    uppdrag: uppdrag || [],
    kontaktuppgifter: kontakt || []
  };
}
