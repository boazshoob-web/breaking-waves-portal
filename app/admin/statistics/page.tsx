'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Anchor,
  FileText,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface Stats {
  summary: {
    totalReports: number;
    totalParticipants: number;
    totalTeams: number;
    totalUsers: number;
  };
  monthlyData: { month: string; count: number }[];
  participantTrend: { month: string; count: number }[];
  byTeam: { team: string; count: number }[];
}

const COLORS = ['#2E75B6', '#27AE60', '#E67E22', '#E74C3C', '#9B59B6', '#1ABC9C', '#F39C12', '#3498DB'];

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/statistics')
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">סטטיסטיקות</h1>
        <p className="text-gray-600 mt-1">נתונים ותובנות על פעילות הארגון</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <FileText className="w-8 h-8 text-ocean-blue mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800">{stats.summary.totalReports}</p>
          <p className="text-sm text-gray-500">דוחות פעילות</p>
        </div>
        <div className="card text-center">
          <Users className="w-8 h-8 text-success-green mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800">{stats.summary.totalParticipants}</p>
          <p className="text-sm text-gray-500">משתתפים פעילים</p>
        </div>
        <div className="card text-center">
          <Anchor className="w-8 h-8 text-warning-orange mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800">{stats.summary.totalTeams}</p>
          <p className="text-sm text-gray-500">צוותים</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-error-red mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800">{stats.summary.totalUsers}</p>
          <p className="text-sm text-gray-500">משתמשים רשומים</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Sailings */}
        <div className="card">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
            <BarChart3 className="w-5 h-5 text-ocean-blue" />
            הפלגות לפי חודש
          </h3>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(label) => label}
                  formatter={(value: any) => [value, 'הפלגות']}
                />
                <Bar dataKey="count" fill="#2E75B6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Participant Trend */}
        <div className="card">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
            <TrendingUp className="w-5 h-5 text-success-green" />
            מגמת משתתפים לפי חודש
          </h3>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.participantTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(label) => label}
                  formatter={(value: any) => [value, 'משתתפים']}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#27AE60"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Breakdown */}
        <div className="card md:col-span-2">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
            <Anchor className="w-5 h-5 text-warning-orange" />
            התפלגות לפי צוות
          </h3>
          {stats.byTeam.length > 0 ? (
            <div className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byTeam}
                    dataKey="count"
                    nameKey="team"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }: any) => `${name} (${value})`}
                  >
                    {stats.byTeam.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [value, 'דוחות']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">אין נתונים להצגה</p>
          )}
        </div>
      </div>
    </div>
  );
}
