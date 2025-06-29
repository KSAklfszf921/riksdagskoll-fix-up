
-- Skapa huvudtabell för ledamöter
CREATE TABLE public.ledamoter (
  iid TEXT PRIMARY KEY, -- intressent_id från API
  tilltalsnamn TEXT,
  efternamn TEXT,
  parti TEXT,
  valkrets TEXT,
  kon TEXT,
  fodd_ar INTEGER,
  status TEXT, -- ledamot, f.d. ledamot, statsråd
  bild_url_80 TEXT,
  bild_url_192 TEXT,
  webbplats_url TEXT,
  biografi_xml_url TEXT,
  senast_uppdaterad TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Skapa tabell för mandatperioder
CREATE TABLE public.mandatperioder (
  id SERIAL PRIMARY KEY,
  iid TEXT REFERENCES public.ledamoter(iid) ON DELETE CASCADE,
  period TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Skapa tabell för uppdrag
CREATE TABLE public.uppdrag (
  id SERIAL PRIMARY KEY,
  iid TEXT REFERENCES public.ledamoter(iid) ON DELETE CASCADE,
  typ TEXT, -- utskott, delegation, etc.
  organ TEXT, -- Ex: Socialutskottet
  roll TEXT, -- ledamot, ordförande, ersättare
  status TEXT, -- pågående, avslutat
  from_date DATE,
  tom_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Skapa tabell för kontaktuppgifter
CREATE TABLE public.kontaktuppgifter (
  id SERIAL PRIMARY KEY,
  iid TEXT REFERENCES public.ledamoter(iid) ON DELETE CASCADE,
  typ TEXT, -- adress, telefon, epost
  uppgift TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Aktivera RLS för alla tabeller (öppna data så vi tillåter läsning för alla)
ALTER TABLE public.ledamoter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandatperioder ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uppdrag ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kontaktuppgifter ENABLE ROW LEVEL SECURITY;

-- Skapa policies för läsning (öppna data)
CREATE POLICY "Allow public read access on ledamoter" 
  ON public.ledamoter FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on mandatperioder" 
  ON public.mandatperioder FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on uppdrag" 
  ON public.uppdrag FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on kontaktuppgifter" 
  ON public.kontaktuppgifter FOR SELECT 
  USING (true);

-- Skapa index för prestanda
CREATE INDEX idx_ledamoter_parti ON public.ledamoter(parti);
CREATE INDEX idx_ledamoter_status ON public.ledamoter(status);
CREATE INDEX idx_ledamoter_valkrets ON public.ledamoter(valkrets);
CREATE INDEX idx_mandatperioder_iid ON public.mandatperioder(iid);
CREATE INDEX idx_uppdrag_iid ON public.uppdrag(iid);
CREATE INDEX idx_kontaktuppgifter_iid ON public.kontaktuppgifter(iid);
