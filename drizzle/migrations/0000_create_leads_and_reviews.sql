CREATE TABLE public.website_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text NOT NULL,
  phone text NOT NULL,
  email text,
  business_type text NOT NULL,
  project_details text NOT NULL,
  budget text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.website_requests TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.website_requests TO service_role;
ALTER TABLE public.website_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a website request"
ON public.website_requests FOR INSERT TO anon, authenticated
WITH CHECK (char_length(name) BETWEEN 2 AND 100 AND char_length(business_name) BETWEEN 2 AND 160 AND char_length(phone) BETWEEN 7 AND 24 AND char_length(project_details) BETWEEN 10 AND 3000);

CREATE TABLE public.client_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  business_name text NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text NOT NULL,
  project_url text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.client_reviews TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_reviews TO service_role;
ALTER TABLE public.client_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a review"
ON public.client_reviews FOR INSERT TO anon, authenticated
WITH CHECK (is_approved = false AND char_length(client_name) BETWEEN 2 AND 100 AND char_length(business_name) BETWEEN 2 AND 160 AND char_length(review) BETWEEN 20 AND 2000);
CREATE POLICY "Anyone can read approved reviews"
ON public.client_reviews FOR SELECT TO anon, authenticated
USING (is_approved = true);

CREATE INDEX client_reviews_approved_created_idx ON public.client_reviews (is_approved, created_at DESC);
CREATE INDEX website_requests_created_idx ON public.website_requests (created_at DESC);