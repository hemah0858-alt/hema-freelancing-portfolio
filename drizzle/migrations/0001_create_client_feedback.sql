CREATE TABLE public.client_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  business_name text NOT NULL,
  email text,
  rating smallint NOT NULL,
  positive_feedback text NOT NULL,
  improvement_feedback text,
  project_type text NOT NULL,
  would_recommend boolean NOT NULL DEFAULT true,
  permission_to_publish boolean NOT NULL DEFAULT false,
  photo_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT client_feedback_rating_range CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT client_feedback_status_check CHECK (status IN ('pending','approved','rejected'))
);

GRANT INSERT ON public.client_feedback TO anon, authenticated;
GRANT SELECT ON public.client_feedback TO anon, authenticated;
GRANT ALL ON public.client_feedback TO service_role;

ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON public.client_feedback FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND char_length(client_name) BETWEEN 2 AND 100
    AND char_length(business_name) BETWEEN 2 AND 160
    AND rating BETWEEN 1 AND 5
    AND char_length(positive_feedback) >= 10
    AND char_length(positive_feedback) <= 2000
    AND char_length(project_type) BETWEEN 2 AND 60
    AND (improvement_feedback IS NULL OR char_length(improvement_feedback) <= 2000)
    AND (email IS NULL OR email = '' OR char_length(email) <= 255)
    AND (photo_url IS NULL OR char_length(photo_url) <= 500)
  );

CREATE POLICY "Public reads approved feedback with permission"
  ON public.client_feedback FOR SELECT TO anon, authenticated
  USING (status = 'approved' AND permission_to_publish = true);

-- Storage: allow visitors to upload their own photo/logo for feedback
CREATE POLICY "Anyone can upload feedback photos"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'feedback-uploads');

COMMENT ON TABLE public.client_reviews IS 'DEPRECATED: replaced by public.client_feedback';