'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CurriculumDay {
  id: number;
  day_number: number;
  position: string;
  skill_level: string;
  title: string;
  description: string | null;
  estimated_duration_minutes: number | null;
  theme: string | null;
}

interface UserPlan {
  id: string;
  user_id: string;
  current_day_number: number;
  plan_started_at: string | null;
  plan_completed_at: string | null;
}

interface UserDayProgress {
  id: string;
  user_id: string;
  day_number: number;
  curriculum_day_id: number | null;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completed_at: string | null;
  self_rating: number | null;
  exercises_skipped: number;
  session_duration_seconds: number | null;
  calories_estimated: number | null;
  notes: string | null;
}

interface DashboardTeam {
  id: string;
  name: string;
  tagline: string | null;
}

interface DashboardData {
  todaySession: {
    day: CurriculumDay | null;
    progress: UserDayProgress | null;
    plan: UserPlan | null;
  } | null;
  streak: number;
  progressPercent: number;
  upcomingDays: CurriculumDay[];
  team: DashboardTeam | null;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    todaySession: null,
    streak: 0,
    progressPercent: 0,
    upcomingDays: [],
    team: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchDashboardData() {
      const supabase = createClient();

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (mounted) {
            setData(prev => ({ ...prev, isLoading: false, error: 'Not authenticated' }));
          }
          return;
        }

        // Fetch user profile for position and skill_level
        const { data: profile } = await supabase
          .from('users')
          .select('position, skill_level')
          .eq('id', user.id)
          .single();

        if (!profile) {
          if (mounted) {
            setData(prev => ({ ...prev, isLoading: false, error: 'Profile not found' }));
          }
          return;
        }

        // Fetch user plan
        const { data: plan } = await supabase
          .from('user_plan')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch today's progress
        const currentDay = plan?.current_day_number ?? 1;
        const { data: todayProgress } = await supabase
          .from('user_day_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', currentDay)
          .single();

        // Fetch today's curriculum day
        const { data: todayCurriculum } = await supabase
          .from('curriculum_day')
          .select('*')
          .eq('day_number', currentDay)
          .eq('position', profile.position)
          .eq('skill_level', profile.skill_level)
          .single();

        // Calculate streak (consecutive completed days)
        const { data: progressHistory } = await supabase
          .from('user_day_progress')
          .select('day_number, status, completed_at')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('day_number', { ascending: false });

        let streak = 0;
        if (progressHistory && progressHistory.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _expectedDay = progressHistory[0].day_number;

          // Check if the most recent completed day is today or yesterday
          const lastCompletedDate = progressHistory[0].completed_at
            ? new Date(progressHistory[0].completed_at)
            : null;

          if (lastCompletedDate) {
            lastCompletedDate.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
              streak = 1;
              for (let i = 1; i < progressHistory.length; i++) {
                const prevDay = progressHistory[i - 1].day_number;
                const currDay = progressHistory[i].day_number;
                if (prevDay - currDay === 1) {
                  streak++;
                } else {
                  break;
                }
              }
            }
          }
        }

        // Calculate progress percent
        const { data: totalDaysData } = await supabase
          .from('curriculum_day')
          .select('day_number', { count: 'exact', head: true })
          .eq('position', profile.position)
          .eq('skill_level', profile.skill_level);

        const totalDays = totalDaysData?.length ?? 60;
        const completedCount = progressHistory?.filter(p => p.status === 'completed').length ?? 0;
        const progressPercent = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

        // Fetch upcoming days (next 5)
        const { data: upcomingDays } = await supabase
          .from('curriculum_day')
          .select('*')
          .eq('position', profile.position)
          .eq('skill_level', profile.skill_level)
          .gt('day_number', currentDay)
          .order('day_number', { ascending: true })
          .limit(5);

        // Fetch team membership
        const { data: teamMembership } = await supabase
          .from('team_members')
          .select(`
            id,
            team_id,
            user_id,
            team:teams(id, name, tagline)
          `)
          .eq('user_id', user.id)
          .single();

        if (mounted) {
          setData({
            todaySession: {
              day: todayCurriculum,
              progress: todayProgress,
              plan,
            },
            streak,
            progressPercent,
            upcomingDays: upcomingDays ?? [],
            team: teamMembership?.team?.[0] ?? null,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (mounted) {
          setData(prev => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch dashboard data',
          }));
        }
      }
    }

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  return data;
}