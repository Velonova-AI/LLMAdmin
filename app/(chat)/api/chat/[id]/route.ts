import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chat = await getChatById({ id });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let canEdit = false;
  
  if (chat.visibility === "private") {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if profile exists and get role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();
    
    const profileExists = !profileError && profile !== null;
    console.log("[GET /api/chat/[id]] Profile exists check:", { 
      userId: user.id, 
      exists: profileExists 
    });
    
    // Get or create profile
    let profileId = user.id;
    let isAdmin = false;
    
    if (!profileExists) {
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email })
        .select('id, role')
        .single();
      
      if (createError && createError.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating profile:', createError);
      } else if (newProfile) {
        profileId = newProfile.id;
        isAdmin = newProfile.role === 'admin';
      }
    } else if (profile) {
      profileId = profile.id;
      isAdmin = profile.role === 'admin';
    }
    
    // Check if user is admin - admins can access any chat
    if (!isAdmin && chat.userId !== profileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    canEdit = true;
  } else {
    canEdit = !!user;
  }

  const messagesFromDb = await getMessagesByChatId({ id });
  const uiMessages = convertToUIMessages(messagesFromDb);

  return NextResponse.json({
    chat,
    messages: uiMessages,
    canEdit,
  });
}

