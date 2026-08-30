import { createClient } from '@/lib/supabase/server';
import { TodaySessionCard } from '@/components/TodaySessionCard';
import { UpcomingDays } from '@/components/UpcomingDays';
import { TeamQuickAction } from '@/components/TeamQuickAction';
import { GlassCard } from '@/components/GlassCard';
import { ProgressRing } from '@/components/ProgressRing';
import { AppShell } from '@/components/AppShell';

interface DashboardData {
  user: {
    id: string;
    name: string | null;
    position: string | null;
    skill_level: string | null;
  } | null;
  plan: {
    id: string;
    user_id: string;
    current_day_number: number;
    plan_started_at: string | null;
    plan_completed_at: string | null;
  } | null;
  todayProgress: {
    id: string;
    user_id: string;
    day_number: number;
    curriculum_day_id: number | null;
    status: string | null;
    completed_at: string | null;
    self_rating: number | null;
    exercises_skipped: number;
    session_duration_seconds: number | null;
    calories_estimated: number | null;
    notes: string | null;
  } | null;
  todayCurriculum: {
    id: number;
    day_number: number;
    position: string;
    skill_level: string;
    title: string;
    description: string | null;
    estimated_duration_minutes: number | null;
    theme: string | null;
  } | null;
  completedProgress: Array<{
    day_number: number;
    status: string;
    completed_at: string | null;
  }>;
  totalDays: number;
  upcomingDays: Array<{
    id: number;
    day_number: number;
    position: string;
    skill_level: string;
    title: string;
    description: string | null;
    estimated_duration_minutes: number | null;
    theme: string | null;
  }>;
  team: {
    id: string;
    name: string;
    tagline: string | null;
  } | null;
  streak: number;
}

async function fetchDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // If not authenticated, return empty data
  if (authError || !user) {
    return {
      user: null,
      plan: null,
      todayProgress: null,
      todayCurriculum: null,
      completedProgress: [],
      totalDays: 0,
      upcomingDays: [],
      team: null,
      streak: 0,
    };
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('id, name, position, skill_level')
    .eq('id', user.id)
    .single();

  // Fetch user plan
  const { data: plan } = await supabase
    .from('user_plan')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const currentDay = plan?.current_day_number ?? 1;

  // Fetch today's progress
  const { data: todayProgress } = await supabase
    .from('user_day_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('day_number', currentDay)
    .single();

  // Fetch today's curriculum day (only if user has a position and skill level set)
  let todayCurriculum = null;
  if (profile?.position && profile?.skill_level) {
    const { data: curriculum } = await supabase
      .from('curriculum_day')
      .select('*')
      .eq('day_number', currentDay)
      .eq('position', profile.position)
      .eq('skill_level', profile.skill_level)
      .single();
    todayCurriculum = curriculum;
  }

  // Fetch all completed progress
  const { data: completedProgress } = await supabase
    .from('user_day_progress')
    .select('day_number, status, completed_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('day_number', { ascending: false });

  // Calculate streak
  let streak = 0;
  if (completedProgress && completedProgress.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletedDate = completedProgress[0].completed_at
      ? new Date(completedProgress[0].completed_at)
      : null;

    if (lastCompletedDate) {
      lastCompletedDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak = 1;
        for (let i = 1; i < completedProgress.length; i++) {
          const prevDay = completedProgress[i - 1].day_number;
          const currDay = completedProgress[i].day_number;
          if (prevDay - currDay === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }
  }

  // Calculate total days and progress percent
  const { data: allDaysData } = await supabase
    .from('curriculum_day')
    .select('id')
    .eq('position', profile?.position ?? '')
    .eq('skill_level', profile?.skill_level ?? '');

  const totalDays = allDaysData?.length ?? 60;

  // Fetch upcoming days (next 5)
  let upcomingDays: typeof todayCurriculum[] = [];
  if (profile?.position && profile?.skill_level) {
    const { data: upcoming } = await supabase
      .from('curriculum_day')
      .select('*')
      .eq('position', profile.position)
      .eq('skill_level', profile.skill_level)
      .gt('day_number', currentDay)
      .order('day_number', { ascending: true })
      .limit(5);
    upcomingDays = upcoming ?? [];
  }

  // Fetch team membership (separate queries to avoid type issues with joins)
  const { data: teamMemberships } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .limit(1);

  let team = null;
  if (teamMemberships && teamMemberships.length > 0) {
    const teamId = teamMemberships[0].team_id;
    const { data: teamData } = await supabase
      .from('teams')
      .select('id, name, tagline')
      .eq('id', teamId)
      .single();
    if (teamData) {
      team = teamData;
    }
  }

  return {
    user: profile,
    plan,
    todayProgress,
    todayCurriculum,
    completedProgress: completedProgress ?? [],
    totalDays,
    upcomingDays,
    team,
    streak,
  };
}

export default async function DashboardPage() {
  const data = await fetchDashboardData();

  const progressPercent = data.totalDays > 0
    ? Math.round((data.completedProgress.length / data.totalDays) * 100)
    : 0;

  return (
    <AppShell
      userName={data.user?.name ?? undefined}
      streak={data.streak}
    >
      {/* Main Content */}
      <main className="space-y-6">
        {/* Today's Session */}
        <section>
          <TodaySessionCard
            day={data.todayCurriculum}
            progress={data.todayProgress}
            plan={data.plan}
          />
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-3 gap-3">
          {/* Progress Card */}
          <GlassCard variant="subtle" className="flex flex-col items-center justify-center py-4">
            <ProgressRing
              progress={progressPercent}
              size={80}
              strokeWidth={6}
              showLabel={false}
            />
            <span className="text-xs text-gray-400 mt-2">{progressPercent}% Done</span>
          </GlassCard>

          {/* Streak Card */}
          <GlassCard variant="subtle" className="flex flex-col items-center justify-center py-4">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xl">🔥</span>
              <span className="text-2xl font-bold text-[#F7E7CE]">{data.streak}</span>
            </div>
            <span className="text-xs text-gray-400">Day Streak</span>
          </GlassCard>

          {/* Position Card */}
          <GlassCard variant="subtle" className="flex flex-col items-center justify-center py-4">
            <span className="text-3xl mb-1">
              {data.user?.position === 'striker' && '⚽'}
              {data.user?.position === 'midfielder' && '🎯'}
              {data.user?.position === 'defender' && '🛡️'}
              {data.user?.position === 'goalkeeper' && '🧤'}
              {!data.user?.position && '⚽'}
            </span>
            <span className="text-xs text-gray-400 text-center capitalize">
              {data.user?.position ?? 'Position'}
            </span>
          </GlassCard>
        </section>

        {/* Upcoming Days */}
        <section>
          <UpcomingDays
            days={data.upcomingDays}
            currentDay={data.plan?.current_day_number ?? data.todayCurriculum?.day_number ?? 1}
          />
        </section>

        {/* Team Quick Action */}
        {data.user && (
          <section>
            <TeamQuickAction
              teamName={data.team?.name}
            />
          </section>
        )}
      </main>
    </AppShell>
  );
}