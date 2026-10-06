ALTER TABLE public.website_requests
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS current_website text,
  ADD COLUMN IF NOT EXISTS website_type text,
  ADD COLUMN IF NOT EXISTS pages_required text,
  ADD COLUMN IF NOT EXISTS lead_source text;
ALTER TABLE public.website_requests ADD CONSTRAINT website_requests_extra_len CHECK (
  (city IS NULL OR char_length(city) <= 100) AND (current_website IS NULL OR char_length(current_website) <= 40)
  AND (website_type IS NULL OR char_length(website_type) <= 60) AND (pages_required IS NULL OR char_length(pages_required) <= 40)
  AND (lead_source IS NULL OR char_length(lead_source) <= 200) AND (email IS NULL OR char_length(email) <= 255)
  AND (budget IS NULL OR char_length(budget) <= 40)) NOT VALID;