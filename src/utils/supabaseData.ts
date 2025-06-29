
import { supabase } from '@/integrations/supabase/client';
import { Anforande } from './anforandeApi';
import { Dokument } from './dokumentApi';
import { Votering } from './voteringApi';

// Anföranden
export async function sparaAnforanden(anforanden: Anforande[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('anforanden')
      .upsert(anforanden.map(a => ({
        anforande_id: a.anforande_id,
        dok_datum: a.dok_datum || null,
        talare: a.talare,
        parti: a.parti,
        intressent_id: a.intressent_id,
        kon: a.kon,
        anforandetyp: a.anforandetyp,
        dok_titel: a.dok_titel,
        rubrik: a.rubrik,
        anforande: a.anforande,
        protokoll_url_xml: a.protokoll_url_xml,
        relaterat_dokument_url: a.relaterat_dokument_url,
        nummer: a.nummer
      })), { onConflict: 'anforande_id' });

    if (error) {
      console.error('Error saving anföranden:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in sparaAnforanden:', error);
    return false;
  }
}

export async function hamtaAnforandenFranDB() {
  const { data, error } = await supabase
    .from('anforanden')
    .select('*')
    .order('dok_datum', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching anföranden:', error);
    return [];
  }
  return data || [];
}

// Dokument
export async function sparaDokument(dokument: Dokument[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dokument')
      .upsert(dokument.map(d => ({
        dok_id: d.dok_id,
        titel: d.titel,
        doktyp: d.doktyp,
        rm: d.rm,
        datum: d.datum || null,
        organ: d.organ,
        status: d.status,
        hangar_id: d.hangar_id,
        relaterat_id: d.relaterat_id,
        dokument_url_text: d.dokument_url_text,
        dokument_url_html: d.dokument_url_html,
        dokument_url_pdf: d.dokument_url_pdf
      })), { onConflict: 'dok_id' });

    if (error) {
      console.error('Error saving dokument:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in sparaDokument:', error);
    return false;
  }
}

// Voteringar
export async function sparaVoteringar(voteringar: Votering[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('voteringar')
      .upsert(voteringar.map(v => ({
        votering_id: v.votering_id,
        dok_id: v.dok_id,
        intressent_id: v.intressent_id,
        namn: v.namn,
        parti: v.parti,
        valkrets: v.valkrets,
        rost: v.rost,
        avser: v.avser,
        votering_datum: v.votering_datum || null
      })));

    if (error) {
      console.error('Error saving voteringar:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in sparaVoteringar:', error);
    return false;
  }
}

// Statistik och aggregerad data
export async function hamtaStatistik() {
  try {
    const [ledamotCount, anforandeCount, dokumentCount, voteringCount] = await Promise.all([
      supabase.from('ledamoter').select('*', { count: 'exact', head: true }),
      supabase.from('anforanden').select('*', { count: 'exact', head: true }),
      supabase.from('dokument').select('*', { count: 'exact', head: true }),
      supabase.from('voteringar').select('*', { count: 'exact', head: true })
    ]);

    return {
      ledamoter: ledamotCount.count || 0,
      anforanden: anforandeCount.count || 0,
      dokument: dokumentCount.count || 0,
      voteringar: voteringCount.count || 0
    };
  } catch (error) {
    console.error('Error fetching statistik:', error);
    return {
      ledamoter: 0,
      anforanden: 0,
      dokument: 0,
      voteringar: 0
    };
  }
}

export async function hamtaPartiStatistik() {
  try {
    const { data, error } = await supabase
      .from('ledamoter')
      .select('parti')
      .not('parti', 'is', null);

    if (error) {
      console.error('Error fetching parti statistik:', error);
      return {};
    }

    const partiCount: { [key: string]: number } = {};
    data?.forEach(ledamot => {
      if (ledamot.parti) {
        partiCount[ledamot.parti] = (partiCount[ledamot.parti] || 0) + 1;
      }
    });

    return partiCount;
  } catch (error) {
    console.error('Error in hamtaPartiStatistik:', error);
    return {};
  }
}
