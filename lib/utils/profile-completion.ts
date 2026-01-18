/**
 * Calculates profile completion percentage based on filled fields
 * 
 * Checks the following fields:
 * - Required fields: startup_name, founder_name, email, industry, stage, bio
 * - Optional fields: website, profile_photo_url
 * 
 * A field is considered "filled" if:
 * - It exists and is not null/undefined
 * - It's not an empty string
 * - It's not the default value "other" (for fields that have this default)
 * 
 * @param profile - Profile object from database
 * @returns Completion percentage (0-100)
 */
export function calculateProfileCompletion(profile: any): number {
  if (!profile) {
    return 0;
  }

  // Helper function to check if a field is filled
  const isFieldFilled = (value: any, isDefaultValue = false): boolean => {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") {
        return false;
      }
      // Check if it's the default "other" value (for fields that default to this)
      if (isDefaultValue && trimmed.toLowerCase() === "other") {
        return false;
      }
      return true;
    }
    return true;
  };

  // Required fields (6 fields) - check with default value validation
  const requiredFields = [
    { value: profile.startup_name || profile.startupName, hasDefault: true },
    { value: profile.founder_name || profile.founderName, hasDefault: true },
    { value: profile.email, hasDefault: false },
    { value: profile.industry, hasDefault: true },
    { value: profile.stage, hasDefault: true },
    { value: profile.bio, hasDefault: true },
  ];

  // Optional fields (2 fields)
  const optionalFields = [
    { value: profile.website, hasDefault: false },
    { value: profile.profile_photo_url || profile.profilePhotoUrl, hasDefault: false },
  ];

  // Count filled required fields
  const filledRequired = requiredFields.filter((field) =>
    isFieldFilled(field.value, field.hasDefault)
  ).length;

  // Count filled optional fields
  const filledOptional = optionalFields.filter((field) =>
    isFieldFilled(field.value, field.hasDefault)
  ).length;

  // Calculate completion using weighted approach
  // Required fields: 70% weight, Optional fields: 30% weight
  const requiredPercentage = (filledRequired / 6) * 70;
  const optionalPercentage = (filledOptional / 2) * 30;
  const totalPercentage = requiredPercentage + optionalPercentage;

  // Round to nearest integer and ensure it's between 0 and 100
  return Math.min(100, Math.max(0, Math.round(totalPercentage)));
}
