import React from 'react';
import { BarChart3, Clock, Target, TrendingUp, Calendar, Coffee } from 'lucide-react';
import { TimerCycle } from '@/types/timer';
import { formatTime } from '@/utils/timeUtils';

interface StatisticsPanelProps {
  cycles: TimerCycle[];
  className?: string;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  cycles,
  className = '',
}) => {
  // Calculate statistics
  const totalCycles = cycles.length;
  const completedCycles = cycles.filter(cycle => cycle.completed).length;
  const totalTime = cycles.reduce((sum, cycle) => sum + cycle.duration, 0);
  const averageTime = totalCycles > 0 ? Math.round(totalTime / totalCycles) : 0;
  
  // Daily statistics
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayCycles = cycles.filter(cycle => {
    const cycleDate = new Date(cycle.startTime);
    cycleDate.setHours(0, 0, 0, 0);
    return cycleDate.getTime() === today.getTime();
  });
  
  // Weekly statistics
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const weekCycles = cycles.filter(cycle => {
    const cycleDate = new Date(cycle.startTime);
    return cycleDate >= weekAgo;
  });
  
  // Most common duration
  const durationCounts = cycles.reduce((acc, cycle) => {
    const duration = cycle.duration;
    acc[duration] = (acc[duration] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const mostCommonDuration = Object.entries(durationCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  // Completion rate
  const completionRate = totalCycles > 0 ? Math.round((completedCycles / totalCycles) * 100) : 0;
  
  // Recent cycles (last 10)
  const recentCycles = cycles
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 10);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
  }> = ({ title, value, icon, subtitle }) => (
    <div className="bg-surface rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Timer"
          value={totalCycles}
          icon={<Target className="w-4 h-4 text-coffee-600" />}
          subtitle={`${completedCycles} tamamlandı`}
        />
        
        <StatCard
          title="Toplam Süre"
          value={formatTime(totalTime)}
          icon={<Clock className="w-4 h-4 text-coffee-600" />}
          subtitle={`${Math.round(totalTime / 3600)} saat`}
        />
        
        <StatCard
          title="Ortalama Süre"
          value={formatTime(averageTime)}
          icon={<TrendingUp className="w-4 h-4 text-coffee-600" />}
          subtitle="Per timer"
        />
        
        <StatCard
          title="Tamamlanma"
          value={`${completionRate}%`}
          icon={<BarChart3 className="w-4 h-4 text-coffee-600" />}
          subtitle="Başarı oranı"
        />
      </div>

      {/* Today's Progress */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-coffee-600" />
            Bugünkü İlerleme
          </h3>
          <span className="text-sm text-muted-foreground">
            {today.toLocaleDateString('tr-TR')}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-coffee-600">{todayCycles.length}</div>
            <div className="text-sm text-muted-foreground">Timer</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-coffee-600">
              {formatTime(todayCycles.reduce((sum, cycle) => sum + cycle.duration, 0))}
            </div>
            <div className="text-sm text-muted-foreground">Toplam Süre</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-coffee-600">
              {weekCycles.length}
            </div>
            <div className="text-sm text-muted-foreground">Bu Hafta</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Coffee className="w-5 h-5 mr-2 text-coffee-600" />
          İçgörüler
        </h3>
        
        <div className="space-y-3">
          {mostCommonDuration && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">En sık kullanılan süre:</span>
              <span className="font-medium text-foreground">
                {formatTime(parseInt(mostCommonDuration))}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ortalama günlük timer:</span>
            <span className="font-medium text-foreground">
              {weekCycles.length > 0 ? Math.round(weekCycles.length / 7) : 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">En uzun çalışma süresi:</span>
            <span className="font-medium text-foreground">
              {totalCycles > 0 ? formatTime(Math.max(...cycles.map(c => c.duration))) : '0:00'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Son Aktiviteler</h3>
        
        {recentCycles.length > 0 ? (
          <div className="space-y-3">
            {recentCycles.map((cycle) => (
              <div key={cycle.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${cycle.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {formatTime(cycle.duration)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(cycle.startTime).toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {cycle.completed ? 'Tamamlandı' : 'Devam Ediyor'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Coffee className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Henüz aktivite yok. İlk timer'ınızı başlatın!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPanel;
