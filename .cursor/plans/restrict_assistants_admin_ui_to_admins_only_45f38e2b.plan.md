# Restrict Assistants Admin UI to Admin Users Only

## Important Clarification
- **Admin DataTable UI**: Only admins can access (view, create, edit, delete assistants)
- **Chat UI**: All authenticated users can use ALL active assistants (not just their own)
- The `/api/assistants` endpoint returns all active assistants for all users
- Other resources (like Chatb) remain filtered by user ownership

## Overview
1. Restrict assistants resource in admin DataTable UI to admin users only (view, create, update, delete)
2. Add creator/owner column to assistant list showing who created each assistant
3. Allow admins to see and use inactive assistants in the multi-modal dropdown
4. Non-admin users should not see the assistants resource in the sidebar or be able to access it
5. **All users can use all active assistants in chat UI** (not filtered by ownership)
6. Other resources remain user-scoped (users only see their own data)

## Changes Required

### 1. Add canAccess Method to AuthProvider
**File:** [`app/admin/authProvider.ts`](app/admin/authProvider.ts)

- Add `canAccess` method to restrict assistants resource in admin UI to admins only
- This controls sidebar visibility and UI access, NOT the chat API endpoint

**Implementation:**
```tsx
export const authProvider = {
  ...baseAuthProvider,
  canAccess: async ({ resource, action }: { resource: string; action: string }) => {
    // If accessing assistants resource in admin UI, check if user is admin
    if (resource === 'assistants') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      return profile?.role === 'admin';
    }
    
    // Allow access to all other resources
    return true;
  },
};
```

### 2. Add Access Control in DataProvider for Assistants
**File:** [`app/admin/dataProvider.ts`](app/admin/dataProvider.ts)

- Add checks at the beginning of all CRUD methods (getList, getOne, create, update, delete, etc.) for assistants resource
- If resource is 'assistants' and user is not admin, throw an error
- This provides server-side protection for the admin UI
- **Keep existing user filtering for other resources** (Chatb, etc.)

**Implementation pattern for each method:**
```tsx
async getList(resource: string, params: any) {
  const userId = await getCurrentUserId();
  const isAdmin = await isAdminUser();
  
  // Block non-admin access to assistants in admin UI
  if (resource === 'assistants') {
    if (!isAdmin) {
      throw new Error('Access denied: Admin only');
    }
    // Admins can see all assistants
    return baseDataProvider.getList(resource, params);
  }
  
  // For other resources, apply existing user filtering logic
  // ... rest of existing logic
}
```

Apply the same pattern to: `getOne`, `create`, `update`, `updateMany`, `delete`, `deleteMany`, `getMany`

### 3. Add Creator Column to AssistantList
**File:** [`app/admin/Assistantlist.tsx`](app/admin/Assistantlist.tsx)

- Add a new column to show who created each assistant
- Use `ReferenceField` component to display the creator's email from the profiles table
- The assistants table has `user_id` field that references `profiles.id`

**Add imports:**
```tsx
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
```

**Add column after line 52:**
```tsx
<DataTable.Col label="Created By">
  <ReferenceField source="user_id" reference="profiles" link={false}>
    <TextField source="email" />
  </ReferenceField>
</DataTable.Col>
```

### 4. Add New Query Functions to customqueries.ts
**File:** [`lib/db/customqueries.ts`](lib/db/customqueries.ts)

- Add two new query functions for assistants:
  1. `getAllActiveAssistants()` - returns all active assistants (no user filter)
  2. `getAllAssistants()` - returns all assistants including inactive (for admins)

**Add imports:**
```tsx
import { assistants } from "./schema/schema";
import { eq, desc } from "drizzle-orm";
```

**Add functions:**
```tsx
/**
 * Get all active assistants (not filtered by user)
 * Used for chat UI where all users can access all active assistants
 */
export async function getAllActiveAssistants() {
  try {
    return await db
      .select()
      .from(assistants)
      .where(eq(assistants.active, true))
      .orderBy(desc(assistants.createdAt));
  } catch (error) {
    console.error("[getAllActiveAssistants] Error:", error);
    throw new Error("Failed to get all active assistants");
  }
}

/**
 * Get all assistants including inactive ones
 * Used for admin users in chat UI
 */
export async function getAllAssistants() {
  try {
    return await db
      .select()
      .from(assistants)
      .orderBy(desc(assistants.createdAt));
  } catch (error) {
    console.error("[getAllAssistants] Error:", error);
    throw new Error("Failed to get all assistants");
  }
}
```

### 5. Modify Assistants API to Use New Query Functions
**File:** [`app/(chat)/api/assistants/route.ts`](app/(chat)/api/assistants/route.ts)

- Modify endpoint to check if user is admin
- If admin: use `getAllAssistants()` to return all assistants (active + inactive)
- If not admin: use `getAllActiveAssistants()` to return all active assistants (regardless of creator)
- This allows all users to use any active assistant in chat

**Implementation:**
```tsx
import { getAllActiveAssistants, getAllAssistants } from "@/lib/db/customqueries";
import { getProfile } from "@/lib/supabase/profiles";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    // Check if user is admin
    const profile = await getProfile(session.user.id);
    const isAdmin = profile?.role === 'admin';

    // Return appropriate assistants based on role
    const assistants = isAdmin 
      ? await getAllAssistants()  // All assistants (active + inactive)
      : await getAllActiveAssistants();  // All active assistants

    return Response.json(assistants, { status: 200 });
  } catch (error) {
    // ... error handling
  }
}
```

### 6. Update Dropdown Filtering Logic
**File:** [`components/multimodal-input.tsx`](components/multimodal-input.tsx)

- Remove the client-side filtering of inactive assistants
- The API now handles filtering based on user role:
  - Admins receive all assistants (including inactive)
  - Regular users receive all active assistants (from any user)
- Update the component to use assistants directly from API

**Remove filtering and update:**
```tsx
// Remove this filtering since API handles it:
// const activeAssistants = assistants.filter(...)

// Use assistants directly:
const selectedAssistant = selectedAssistantId
  ? assistants.find((a: { id: string }) => a.id === selectedAssistantId)
  : null;

// In the map, use assistants directly:
{assistants.length > 0 ? (
  <ModelSelectorGroup heading="Assistants">
    {assistants.map((assistant: { id: string; name: string; provider: string }) => {
      // ... rest of mapping logic
    })}
  </ModelSelectorGroup>
) : (
  // ... empty state
)}
```

## Implementation Notes

- The `canAccess` method in authProvider controls admin UI visibility (sidebar, buttons) only
- The dataProvider checks provide server-side protection for admin UI operations
- The `/api/assistants` endpoint returns all active assistants for all users (not user-scoped)
- Admins get all assistants (active + inactive) from the API
- Regular users get all active assistants (from any user) from the API
- Other resources (Chatb, etc.) remain user-scoped via existing dataProvider logic
- The creator column uses ReferenceField to show email from profiles table
- **New query functions are added to `customqueries.ts` as requested**

## Access Summary

| User Type | Admin UI Access | Chat UI Access | Can See Inactive |
|-----------|----------------|----------------|------------------|
| Admin | Yes (all assistants) | Yes (all assistants) | Yes |
| Regular User | No | Yes (all active assistants) | No |

## Data Flow

**Admin UI:**
```
User accesses assistants resource in admin UI
  ↓
authProvider.canAccess() checks role
  ↓
If not admin → Resource hidden from UI
  ↓
If admin → Resource visible
  ↓
DataProvider methods check admin status
  ↓
If not admin → Error thrown
  ↓
If admin → Full CRUD access to all assistants
```

**Chat UI:**
```
User opens assistant selector in chat
  ↓
/api/assistants endpoint called
  ↓
Endpoint checks user role from profile
  ↓
If admin → Calls getAllAssistants() → Returns all assistants (active + inactive)
  ↓
If not admin → Calls getAllActiveAssistants() → Returns all active assistants
  ↓
Component displays assistants from API response
```

**Other Resources (Chatb, etc.):**
```
User accesses resource
  ↓
DataProvider checks resource type
  ↓
If assistants → Admin check (as above)
  ↓
If other resource → Apply user_id filtering (existing behavior)
  ↓
User only sees their own data
```
