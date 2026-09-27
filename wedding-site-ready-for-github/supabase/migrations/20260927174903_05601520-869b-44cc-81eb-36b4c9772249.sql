CREATE TABLE public.wedding_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL CHECK (char_length(trim(guest_name)) BETWEEN 2 AND 100),
  attending boolean NOT NULL,
  guest_count integer NOT NULL DEFAULT 1 CHECK (guest_count BETWEEN 0 AND 20),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wedding_rsvps TO anon, authenticated;
GRANT ALL ON public.wedding_rsvps TO service_role;
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view wedding RSVPs" ON public.wedding_rsvps FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit a wedding RSVP" ON public.wedding_rsvps FOR INSERT TO anon, authenticated WITH CHECK (char_length(trim(guest_name)) BETWEEN 2 AND 100 AND guest_count BETWEEN 0 AND 20 AND ((attending = true AND guest_count >= 1) OR (attending = false AND guest_count = 0)));

CREATE TABLE public.wedding_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL CHECK (char_length(trim(guest_name)) BETWEEN 2 AND 100),
  message text NOT NULL CHECK (char_length(trim(message)) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wedding_comments TO anon, authenticated;
GRANT ALL ON public.wedding_comments TO service_role;
ALTER TABLE public.wedding_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view wedding comments" ON public.wedding_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can leave a wedding comment" ON public.wedding_comments FOR INSERT TO anon, authenticated WITH CHECK (char_length(trim(guest_name)) BETWEEN 2 AND 100 AND char_length(trim(message)) BETWEEN 1 AND 1000);