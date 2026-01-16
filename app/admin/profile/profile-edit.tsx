"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useDataProvider,
  useGetIdentity,
  useNotify,
  SaveContextProvider,
  required,
} from "ra-core";
import { SimpleForm } from "@/components/admin/simple-form";
import { TextInput } from "@/components/admin/text-input";
import { SelectInput } from "@/components/admin/select-input";
import { FileInput, FileInputPreview } from "@/components/admin/file-input";
import { useProfile } from "./profile-context";
import { uploadProfilePhoto } from "@/lib/supabase/storage";
import { useRecordContext } from "ra-core";

// Image preview component for FileInput
const ImagePreview = () => {
  const file = useRecordContext();
  if (!file?.src) return null;
  
  return (
    <img
      src={file.src}
      alt={file.title || "Profile photo"}
      className="h-32 w-32 object-cover rounded-lg"
    />
  );
};

const industries = [
  "AI",
  "Bio + Healthcare",
  "Consumer",
  "Cybersecurity",
  "Fintech",
  "Infrastructure",
  "Robotics + Hardware",
  "SaaS",
  "Supply Chain + Automation",
];

const startupStages = [
  "Pre-Seed stage",
  "Seed stage",
  "Early stage",
  "Growth stage",
  "Expansion stage",
  "Exit stage",
];

// Email validation function
const emailValidator = (value: string) => {
  if (!value) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Please enter a valid email address";
  }
  return undefined;
};

// Transform database profile to form format
const transformProfileToForm = (profile: any) => {
  if (!profile) return {};
  
  return {
    startupName: profile.startup_name || profile.startupName || "",
    founderName: profile.founder_name || profile.founderName || "",
    email: profile.email || "",
    industry: profile.industry || "",
    stage: profile.stage || "",
    bio: profile.bio || "",
    website: profile.website || "",
    profilePhoto: profile.profile_photo_url
      ? {
          src: profile.profile_photo_url,
          title: "Profile Photo",
        }
      : null,
  };
};

// Transform form data to database format
const transformFormToProfile = (formData: any) => {
  // Ensure required fields are not empty (validation should catch this, but double-check)
  const startupName = formData.startupName?.trim();
  const founderName = formData.founderName?.trim();
  const industry = formData.industry?.trim();
  const stage = formData.stage?.trim();
  const bio = formData.bio?.trim();

  if (!startupName || !founderName || !industry || !stage || !bio) {
    throw new Error("Required fields cannot be empty");
  }

  return {
    startup_name: startupName,
    founder_name: founderName,
    email: formData.email?.trim(),
    industry: industry,
    stage: stage,
    bio: bio,
    website: formData.website?.trim() || null,
    profile_photo_url: formData.profilePhotoUrl || undefined,
  };
};

export const ProfileEdit = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { data: identity } = useGetIdentity();
  const { refreshProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any>({});

  // Fetch full profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await dataProvider.getUserProfile();
        setRecord(transformProfileToForm(result.data));
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        // Fallback to identity data if available
        if (identity) {
          setRecord(transformProfileToForm(identity));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dataProvider, identity]);

  const handleSave = useCallback(
    async (values: any) => {
      setSaving(true);
      try {
        // Handle profile photo upload if a new file was selected
        let profilePhotoUrl = values.profilePhoto?.src;
        
        if (values.profilePhoto?.rawFile) {
          // New file uploaded, upload it
          const userId = identity?.id;
          if (!userId) {
            throw new Error("User ID not found");
          }
          
          // Ensure userId is a string
          const userIdString = String(userId);
          
          try {
            profilePhotoUrl = await uploadProfilePhoto(
              values.profilePhoto.rawFile,
              userIdString
            );
          } catch (uploadError: any) {
            setSaving(false);
            notify(
              uploadError?.message || "Failed to upload profile photo. Please try again.",
              { type: "error" }
            );
            throw uploadError;
          }
        }

        // Transform form data, including profile photo URL
        const profileData = transformFormToProfile({
          ...values,
          profilePhotoUrl,
        });
        
        await dataProvider.updateUserProfile({ data: profileData });
        
        setSaving(false);
        refreshProfile();
        notify("Your profile has been updated", { type: "success" });
      } catch (error: any) {
        setSaving(false);
        
        // If it's a validation error with field-specific errors, let it through
        if (error?.body?.errors) {
          throw error;
        }
        
        notify(
          error?.message || "A technical error occurred while updating your profile. Please try later.",
          { type: "error" }
        );
        throw error;
      }
    },
    [dataProvider, notify, refreshProfile, identity]
  );

  const saveContext = useMemo(
    () => ({
      save: handleSave,
      saving,
    }),
    [saving, handleSave]
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <SaveContextProvider value={saveContext}>
        <SimpleForm record={record}>
          <TextInput
            source="startupName"
            label="Startup Name"
            validate={required()}
          />
          <TextInput
            source="founderName"
            label="Founder Name"
            validate={required()}
          />
          <TextInput
            source="email"
            label="Email"
            validate={[required(), emailValidator]}
          />
          <SelectInput
            source="industry"
            label="Industry"
            validate={required()}
            choices={industries.map((industry) => ({
              id: industry,
              name: industry,
            }))}
          />
          <SelectInput
            source="stage"
            label="Startup Stage"
            validate={required()}
            choices={startupStages.map((stage) => ({
              id: stage,
              name: stage,
            }))}
          />
          <TextInput
            source="bio"
            label="Bio"
            multiline
            rows={4}
            validate={required()}
          />
          <TextInput source="website" label="Website" />
          <FileInput
            source="profilePhoto"
            label="Profile Photo"
            accept={{ "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] }}
            placeholder="Drop an image here or click to select"
          >
            <ImagePreview />
          </FileInput>
        </SimpleForm>
      </SaveContextProvider>
    </div>
  );
};

