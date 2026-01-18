import { supabaseDataProvider } from 'ra-supabase-core';
import { createClient } from '@/lib/supabase/client';
import type { DataProvider } from 'ra-core';
import { getProfile, updateProfile } from '@/lib/supabase/profiles';

// Create browser-based Supabase client
export const supabase = createClient();

// #region agent log
if(typeof window!=='undefined'){fetch('http://127.0.0.1:7242/ingest/0250316e-cc04-48a9-9b15-1e69ff1db2a9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'bruxelles/app/admin/dataProvider.ts:6',message:'dataProvider supabase client created',data:{isClient:typeof window!=='undefined',hostname:typeof window!=='undefined'?window.location.hostname:'server'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});}
// #endregion

// Base data provider
const baseDataProvider = supabaseDataProvider({
    instanceUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseClient: supabase,
});

// Helper to get current user ID
async function getCurrentUserId(): Promise<string | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id || null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Helper to check if current user is an admin
async function isAdminUser(): Promise<boolean> {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return false;

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            return false;
        }

        // Check if user role is 'admin'
        return profile.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Map resource names to their user ID field names
const getUserField = (resource: string): string | null => {
    const userFieldMap: Record<string, string> = {
        'assistants': 'user_id',
        'Chatb': 'userId',
    };
    return userFieldMap[resource] || null;
};

// Wrapper that adds user filtering
export const dataProvider: DataProvider = {
    ...baseDataProvider,
    
    async getList(resource: string, params: any) {
        const userId = await getCurrentUserId();
        const isAdmin = await isAdminUser();
        
        // If admin, skip user filtering - they can see all data
        if (isAdmin) {
            return baseDataProvider.getList(resource, params);
        }
        
        const userField = getUserField(resource);
        if (userId && userField) {
            const filteredParams = {
                ...params,
                filter: {
                    ...params.filter,
                    [userField]: userId,
                },
            };
            return baseDataProvider.getList(resource, filteredParams);
        }
        
        return baseDataProvider.getList(resource, params);
    },

    async getOne(resource: string, params: any) {
        const userId = await getCurrentUserId();
        const isAdmin = await isAdminUser();
        
        // If admin, skip user filtering - they can see all data
        if (isAdmin) {
            return baseDataProvider.getOne(resource, params);
        }
        
        const userField = getUserField(resource);
        if (userId && userField) {
            // First get the record
            const result = await baseDataProvider.getOne(resource, params);
            
            // Check if it belongs to the user
            if (result.data[userField] !== userId) {
                throw new Error('Not found');
            }
            
            return result;
        }
        
        return baseDataProvider.getOne(resource, params);
    },

    async getMany(resource: string, params: any) {
        const userId = await getCurrentUserId();
        const isAdmin = await isAdminUser();
        
        // If admin, skip user filtering - they can see all data
        if (isAdmin) {
            return baseDataProvider.getMany(resource, params);
        }
        
        const userField = getUserField(resource);
        if (userId && userField) {
            // For getMany, we need to filter the IDs by user ownership
            // First get all the requested records
            const results = await Promise.all(
                params.ids.map((id: string) => 
                    baseDataProvider.getOne(resource, { id }).catch(() => null)
                )
            );
            
            // Filter to only those belonging to the user
            const filteredData = results
                .filter((result) => result && result.data[userField] === userId)
                .map((result) => result!.data);
            
            return {
                data: filteredData,
            };
        }
        
        return baseDataProvider.getMany(resource, params);
    },

    async update(resource: string, params: any) {
        const userId = await getCurrentUserId();
        const isAdmin = await isAdminUser();
        
        // If admin, skip user filtering - they can update all data
        if (isAdmin) {
            return baseDataProvider.update(resource, params);
        }
        
        const userField = getUserField(resource);
        if (userId && userField) {
            // Verify ownership before updating
            const existing = await baseDataProvider.getOne(resource, { id: params.id });
            
            if (existing.data[userField] !== userId) {
                throw new Error('Not authorized');
            }
        }
        
        return baseDataProvider.update(resource, params);
    },

    async updateMany(resource: string, params: any) {
        const userId = await getCurrentUserId();
        const isAdmin = await isAdminUser();
        
        // If admin, skip user filtering - they can update all data
        if (isAdmin) {
            return baseDataProvider.updateMany(resource, params);
        }
        
        const userField = getUserField(resource);
        if (userId && userField) {
            // Filter to only update records belonging to the user
            const results = await Promise.all(
                params.ids.map((id: string) => 
                    baseDataProvider.getOne(resource, { id }).catch(() => null)
                )
            );
            
            const userOwnedIds = results
                .filter((result) => result && result.data[userField] === userId)
                .map((result) => result!.data.id);
            
            if (userOwnedIds.length === 0) {
                return { data: [] };
            }
            
            return baseDataProvider.updateMany(resource, {
                ...params,
                ids: userOwnedIds,
            });
        }
        
        return baseDataProvider.updateMany(resource, params);
    },

    async delete(resource: string, params: any) {
        const userId = await getCurrentUserId();
        const isAdmin = await isAdminUser();
        
        // If admin, skip user filtering - they can delete all data
        if (isAdmin) {
            // For Chatb, use the API route that handles foreign keys properly
            if (resource === 'Chatb') {
                const response = await fetch(`/api/chat?id=${params.id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to delete chat: ${response.statusText}`);
                }
                
                const deletedChat = await response.json();
                return { data: deletedChat };
            }
            
            return baseDataProvider.delete(resource, params);
        }
        
        const userField = getUserField(resource);
        if (userId && userField) {
            // Verify ownership before deleting
            const existing = await baseDataProvider.getOne(resource, { id: params.id });
            
            if (existing.data[userField] !== userId) {
                throw new Error('Not authorized');
            }
        }
        
        // For Chatb, use the API route that handles foreign keys properly
        if (resource === 'Chatb') {
            const response = await fetch(`/api/chat?id=${params.id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Failed to delete chat: ${response.statusText}`);
            }
            
            const deletedChat = await response.json();
            return { data: deletedChat };
        }
        
        return baseDataProvider.delete(resource, params);
    },

    async deleteMany(resource: string, params: any) {
        const userId = await getCurrentUserId();
        const isAdmin = await isAdminUser();
        
        // If admin, skip user filtering - they can delete all data
        if (isAdmin) {
            // For Chatb, use the API route for each deletion
            if (resource === 'Chatb') {
                const deletePromises = params.ids.map(async (id: string) => {
                    const response = await fetch(`/api/chat?id=${id}`, {
                        method: 'DELETE',
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Failed to delete chat ${id}: ${response.statusText}`);
                    }
                    
                    return await response.json();
                });
                
                const deletedChats = await Promise.all(deletePromises);
                return { data: deletedChats };
            }
            
            return baseDataProvider.deleteMany(resource, params);
        }
        
        const userField = getUserField(resource);
        if (userId && userField) {
            // Filter to only delete records belonging to the user
            const results = await Promise.all(
                params.ids.map((id: string) => 
                    baseDataProvider.getOne(resource, { id }).catch(() => null)
                )
            );
            
            const userOwnedIds = results
                .filter((result) => result && result.data[userField] === userId)
                .map((result) => result!.data.id);
            
            if (userOwnedIds.length === 0) {
                return { data: [] };
            }
            
            // For Chatb, use the API route for each deletion
            if (resource === 'Chatb') {
                const deletePromises = userOwnedIds.map(async (id: string) => {
                    const response = await fetch(`/api/chat?id=${id}`, {
                        method: 'DELETE',
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Failed to delete chat ${id}: ${response.statusText}`);
                    }
                    
                    return await response.json();
                });
                
                const deletedChats = await Promise.all(deletePromises);
                return { data: deletedChats };
            }
            
            return baseDataProvider.deleteMany(resource, {
                ...params,
                ids: userOwnedIds,
            });
        }
        
        return baseDataProvider.deleteMany(resource, params);
    },

    getUserProfile: async () => {
        try {
          const profile = await getProfile();
          return { data: profile };
        } catch (error) {
          console.error('Error fetching user profile:', error);
          throw error;
        }
      },
    
      updateUserProfile: async (params: { data: any }) => {
        try {
          const updatedProfile = await updateProfile(params.data);
          return { data: updatedProfile };
        } catch (error: any) {
          console.error('Error updating user profile:', error);
          
          // Check for unique constraint violation on email
          // PostgreSQL error code 23505 is unique_violation
          // Supabase might return this in different formats
          const errorMessage = error?.message || '';
          const errorCode = error?.code || error?.error?.code;
          
          // Check if it's a unique constraint error related to email
          if (
            errorCode === '23505' ||
            errorMessage.includes('unique constraint') ||
            errorMessage.includes('duplicate key') ||
            errorMessage.includes('profiles_email_unique') ||
            (errorMessage.toLowerCase().includes('email') && 
             (errorMessage.toLowerCase().includes('already') || 
              errorMessage.toLowerCase().includes('exists') ||
              errorMessage.toLowerCase().includes('unique')))
          ) {
            // Throw ValidationError in React Admin format
            const validationError: any = new Error('Validation error');
            validationError.body = {
              errors: {
                email: 'This email is already taken. Please use a different email address.',
              },
            };
            throw validationError;
          }
          
          throw error;
        }
      },
};



