import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Returns a short-lived signed URL for a feedback photo, but only when the
// matching feedback row is approved and the client gave permission to publish.
export const getFeedbackPhotoUrl = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({ path: z.string().min(1).max(300).regex(/^[a-zA-Z0-9._-]+$/, "Invalid photo path") })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("client_feedback")
      .select("id")
      .eq("photo_url", data.path)
      .eq("status", "approved")
      .eq("permission_to_publish", true)
      .maybeSingle();
    if (error || !row) return null;
    const { data: signed } = await supabaseAdmin.storage
      .from("feedback-uploads")
      .createSignedUrl(data.path, 60 * 60);
    return signed?.signedUrl ?? null;
  });
