import { createClient } from "@/lib/supabase/server";

const PROFILE_BUCKET = "profile-photos";
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

/**
 * Upload a profile photo and return the public path.
 * Validates file size (max 2MB) and image MIME type.
 */
export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Profile photo must be under 2MB. Got ${Math.round(file.size / 1024)}KB.`);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Profile photo must be a JPEG, PNG, or WebP image."
    );
  }

  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/profile.${fileExt ?? "jpg"}`;

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  return filePath;
}

/**
 * Get a signed URL for accessing a profile photo.
 * Signed URLs expire after the specified duration (default 1 hour).
 */
export async function getProfilePhotoUrl(
  userId: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  const supabase = await createClient();
  const filePath = `${userId}/profile.jpg`;

  const { data, error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .createSignedUrl(filePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}