interface AthleteStatsProps {
  stats: {
    totalAthletes: number
    activeAthletes: number
    alumniAthletes: number
    avgScore: number
    avgFollowers: number
    avgEngagement: number
  }
}

export function AthleteStats({ stats }: AthleteStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-blue-600">{stats.totalAthletes}</div>
        <div className="text-sm text-gray-600">Total Athletes</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-green-600">{stats.activeAthletes}</div>
        <div className="text-sm text-gray-600">Active</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-purple-600">{stats.alumniAthletes}</div>
        <div className="text-sm text-gray-600">Alumni</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-orange-600">{stats.avgScore.toFixed(1)}</div>
        <div className="text-sm text-gray-600">Avg Score</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-red-600">
          {stats.avgFollowers > 1000 
            ? `${(stats.avgFollowers / 1000).toFixed(1)}K` 
            : stats.avgFollowers.toFixed(0)
          }
        </div>
        <div className="text-sm text-gray-600">Avg Followers</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{stats.avgEngagement.toFixed(2)}%</div>
        <div className="text-sm text-gray-600">Avg Engagement</div>
      </div>
    </div>
  )
}
