'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Send, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { InvitationStats } from '@/types/invitation';

interface InvitationStatsProps {
  stats: InvitationStats;
}

export function InvitationStats({ stats }: InvitationStatsProps) {
  const statCards = [
    {
      title: 'Total Invitations',
      value: stats.total,
      icon: Users,
      description: 'All time',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Pending',
      value: stats.pending + stats.sent,
      icon: Clock,
      description: 'Awaiting acceptance',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Accepted',
      value: stats.accepted,
      icon: CheckCircle2,
      description: 'Active users',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Expired',
      value: stats.expired,
      icon: XCircle,
      description: 'Need resending',
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
