
-- First, let's see what policies currently exist and drop them properly
DROP POLICY IF EXISTS "Anyone can view dialogue scenarios" ON public.dialogue_scenarios;
DROP POLICY IF EXISTS "Allow scenario creation" ON public.dialogue_scenarios;
DROP POLICY IF EXISTS "Users can view dialogue scenarios" ON public.dialogue_scenarios;
DROP POLICY IF EXISTS "Users can create their own scenarios" ON public.dialogue_scenarios;
DROP POLICY IF EXISTS "Users can update their own scenarios" ON public.dialogue_scenarios;
DROP POLICY IF EXISTS "Users can delete their own scenarios" ON public.dialogue_scenarios;

-- Now create the correct policies
-- Allow everyone to view scenarios (both system and user-created)
CREATE POLICY "View all dialogue scenarios" 
  ON public.dialogue_scenarios 
  FOR SELECT 
  USING (true);

-- Allow insertion of system scenarios (where created_by is null) and user scenarios
CREATE POLICY "Insert dialogue scenarios" 
  ON public.dialogue_scenarios 
  FOR INSERT 
  WITH CHECK (
    created_by IS NULL OR created_by = auth.uid()
  );

-- Allow users to update their own scenarios only
CREATE POLICY "Update own dialogue scenarios" 
  ON public.dialogue_scenarios 
  FOR UPDATE 
  USING (created_by = auth.uid());

-- Allow users to delete their own scenarios only  
CREATE POLICY "Delete own dialogue scenarios" 
  ON public.dialogue_scenarios 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE public.dialogue_scenarios ENABLE ROW LEVEL SECURITY;
