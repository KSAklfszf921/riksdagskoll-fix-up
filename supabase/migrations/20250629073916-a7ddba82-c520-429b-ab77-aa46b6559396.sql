
-- Skapa tabell för anföranden
CREATE TABLE public.anforanden (
  anforande_id TEXT PRIMARY KEY,
  dok_datum DATE,
  talare TEXT,
  parti TEXT,
  intressent_id TEXT REFERENCES public.ledamoter(iid) ON DELETE CASCADE,
  kon TEXT,
  anforandetyp TEXT,
  dok_titel TEXT,
  rubrik TEXT,
  anforande TEXT,
  protokoll_url_xml TEXT,
  relaterat_dokument_url TEXT,
  nummer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Skapa tabell för dokument
CREATE TABLE public.dokument (
  dok_id TEXT PRIMARY KEY,
  titel TEXT,
  doktyp TEXT,
  rm TEXT,
  datum DATE,
  organ TEXT,
  status TEXT,
  hangar_id TEXT,
  relaterat_id TEXT,
  dokument_url_text TEXT,
  dokument_url_html TEXT,
  dokument_url_pdf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Skapa tabell för voteringar
CREATE TABLE public.voteringar (
  id SERIAL PRIMARY KEY,
  votering_id TEXT,
  dok_id TEXT REFERENCES public.dokument(dok_id) ON DELETE CASCADE,
  intressent_id TEXT REFERENCES public.ledamoter(iid) ON DELETE CASCADE,
  namn TEXT,
  parti TEXT,
  valkrets TEXT,
  rost TEXT,
  avser TEXT,
  votering_datum DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Uppdatera kontaktuppgifter tabellen för bättre struktur
ALTER TABLE public.kontaktuppgifter 
DROP CONSTRAINT IF EXISTS kontaktuppgifter_pkey;

ALTER TABLE public.kontaktuppgifter 
ADD COLUMN IF NOT EXISTS adress TEXT,
ADD COLUMN IF NOT EXISTS telefon TEXT,
ADD COLUMN IF NOT EXISTS epost TEXT;

-- Aktivera RLS för nya tabeller
ALTER TABLE public.anforanden ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dokument ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voteringar ENABLE ROW LEVEL SECURITY;

-- Skapa policies för läsning (öppna data)
CREATE POLICY "Allow public read access on anforanden" 
  ON public.anforanden FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on dokument" 
  ON public.dokument FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on voteringar" 
  ON public.voteringar FOR SELECT 
  USING (true);

-- Skapa index för prestanda
CREATE INDEX idx_anforanden_intressent_id ON public.anforanden(intressent_id);
CREATE INDEX idx_anforanden_parti ON public.anforanden(parti);
CREATE INDEX idx_anforanden_dok_datum ON public.anforanden(dok_datum);
CREATE INDEX idx_anforanden_anforandetyp ON public.anforanden(anforandetyp);

CREATE INDEX idx_dokument_doktyp ON public.dokument(doktyp);
CREATE INDEX idx_dokument_rm ON public.dokument(rm);
CREATE INDEX idx_dokument_organ ON public.dokument(organ);
CREATE INDEX idx_dokument_datum ON public.dokument(datum);

CREATE INDEX idx_voteringar_dok_id ON public.voteringar(dok_id);
CREATE INDEX idx_voteringar_intressent_id ON public.voteringar(intressent_id);
CREATE INDEX idx_voteringar_parti ON public.voteringar(parti);
CREATE INDEX idx_voteringar_votering_id ON public.voteringar(votering_id);

-- Lägg till unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS unique_mandatperiod_per_ledamot 
  ON public.mandatperioder(iid, period);

CREATE UNIQUE INDEX IF NOT EXISTS unique_votering_per_person 
  ON public.voteringar(votering_id, intressent_id) 
  WHERE votering_id IS NOT NULL;
