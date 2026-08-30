'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type OnboardingFormData = {
  // Step 1: Basic Info
  name: string;
  age: number;
  height_cm: number;
  weight_kg: number;

  // Step 2: Fitness Profile
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  position: 'striker' | 'midfielder' | 'defender' | 'goalkeeper';
  dominant_foot: 'left' | 'right' | 'both';

  // Step 3: Baseline Fitness
  baseline_pushups: number;
  baseline_situps: number;
  baseline_run_distance_meters?: number;

  // Step 4: Preferences
  available_time_minutes: number;
  equipment: string[];
  training_context: 'solo' | 'with_friends' | 'both';
  team_decision: 'create' | 'join' | 'skip';
  team_name?: string;
  invite_token?: string;
};

export async function completeOnboarding(formData: OnboardingFormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const userId = user.id;

  // Upsert user profile
  const { error: userError } = await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        name: formData.name,
        age: formData.age,
        height_cm: formData.height_cm,
        weight_kg: formData.weight_kg,
        skill_level: formData.skill_level,
        position: formData.position,
        dominant_foot: formData.dominant_foot,
        baseline_pushups: formData.baseline_pushups,
        baseline_situps: formData.baseline_situps,
        baseline_run_distance_meters: formData.baseline_run_distance_meters ?? null,
        available_time_minutes: formData.available_time_minutes,
        training_context: formData.training_context,
        onboarding_completed: true,
      },
      { onConflict: 'id' }
    );

  if (userError) {
    console.error('Onboarding users error:', userError);
    return { error: 'Failed to save profile' };
  }

  // Insert equipment records
  if (formData.equipment.length > 0) {
    const { error: equipmentError } = await supabase
      .from('user_equipment')
      .upsert(
        formData.equipment.map((eq) => ({
          user_id: userId,
          equipment_type: eq,
        })),
        { onConflict: 'user_id,equipment_type' }
      );

    if (equipmentError) {
      console.error('Onboarding equipment error:', equipmentError);
    }
  }

  // Insert baseline fitness test if distance provided
  if (
    formData.baseline_run_distance_meters &&
    formData.baseline_run_distance_meters > 0
  ) {
    const { error: fitnessError } = await supabase.from('fitness_retest').insert({
      user_id: userId,
      test_type: 'run',
      value: formData.baseline_run_distance_meters,
    });

    if (fitnessError) {
      console.error('Onboarding fitness error:', fitnessError);
    }
  }

  // Create team if requested
  let teamId: string | null = null;
  if (formData.team_decision === 'create' && formData.team_name) {
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: formData.team_name,
        created_by: userId,
      })
      .select('id')
      .single();

    if (teamError) {
      console.error('Onboarding team creation error:', teamError);
    } else {
      teamId = teamData?.id ?? null;
    }

    // Add creator as team member
    if (teamId) {
      const { error: memberError } = await supabase.from('team_members').insert({
        team_id: teamId,
        user_id: userId,
        position: formData.position,
      });

      if (memberError) {
        console.error('Onboarding team member error:', memberError);
      }
    }
  } else if (formData.team_decision === 'join' && formData.invite_token) {
    // Validate invite token
    const { data: inviteData, error: inviteError } = await supabase
      .from('invite_tokens')
      .select('team_id')
      .eq('token', formData.invite_token)
      .eq('expires_at', new Date().toISOString())
      .or(`expires_at.gt.${new Date().toISOString()}`)
      .single();

    if (inviteError || !inviteData) {
      return { error: 'Invalid or expired invite token' };
    }

    teamId = inviteData.team_id;

    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: userId,
        position: formData.position,
      });

    if (memberError && memberError.code !== '23505') {
      // Ignore duplicate key (already member)
      console.error('Onboarding team join error:', memberError);
    }
  }

  // Create user plan
  const { error: planError } = await supabase.from('user_plan').insert({
    user_id: userId,
    current_day_number: 1,
    plan_started_at: new Date().toISOString(),
  });

  if (planError) {
    console.error('Onboarding plan creation error:', planError);
  }

  // Redirect to dashboard
  redirect('/dashboard');
}