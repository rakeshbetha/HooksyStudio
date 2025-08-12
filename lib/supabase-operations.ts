import { supabaseBrowser } from './supabase-browser'

// Create Collection
export async function createCollection(title: string) {
  const { data: { user } } = await supabaseBrowser.auth.getUser()
  if (!user) throw new Error('Not logged in')
  
  const { data, error } = await supabaseBrowser
    .from('collections')
    .insert({ title, user_id: user.id })
    .select()
    .single()
    
  if (error) throw error
  return data
}

// Get Collections + Hooks
export async function getCollections() {
  console.log('getCollections called')
  
  const { data, error } = await supabaseBrowser
    .from('collections')
    .select(`
      id, 
      title, 
      created_at, 
      hooks(
        id, 
        text, 
        platform, 
        scores, 
        created_at
      )
    `)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Supabase error getting collections:', error)
    throw error
  }
  
  console.log('getCollections result:', data)
  return data
}

// Save Hook
export async function saveHook(collectionId: string, text: string, platform?: string, scores?: any) {
  console.log('saveHook called with:', { collectionId, text, platform, scores })
  
  if (!collectionId || !text) {
    throw new Error('Missing required parameters: collectionId and text are required')
  }
  
  const { data, error } = await supabaseBrowser
    .from('hooks')
    .insert({
      collection_id: collectionId, 
      text, 
      platform, 
      scores
    })
    .select()
    .single()
    
  if (error) {
    console.error('Supabase error saving hook:', error)
    throw error
  }
  
  console.log('Hook saved successfully:', data)
  return data
}

// Update Collection
export async function updateCollection(id: string, title: string) {
  const { data, error } = await supabaseBrowser
    .from('collections')
    .update({ title })
    .eq('id', id)
    .select()
    .single()
    
  if (error) throw error
  return data
}

// Delete Collection
export async function deleteCollection(id: string) {
  const { error } = await supabaseBrowser
    .from('collections')
    .delete()
    .eq('id', id)
    
  if (error) throw error
}

// Update Hook
export async function updateHook(id: string, updates: { text?: string; platform?: string; scores?: any }) {
  const { data, error } = await supabaseBrowser
    .from('hooks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
    
  if (error) throw error
  return data
}

// Delete Hook
export async function deleteHook(id: string) {
  const { error } = await supabaseBrowser
    .from('hooks')
    .delete()
    .eq('id', id)
    
  if (error) throw error
}

// Get single collection with hooks
export async function getCollection(id: string) {
  const { data, error } = await supabaseBrowser
    .from('collections')
    .select(`
      id, 
      title, 
      created_at, 
      hooks(
        id, 
        text, 
        platform, 
        scores, 
        created_at
      )
    `)
    .eq('id', id)
    .single()
    
  if (error) throw error
  return data
} 