
export const getCategoryName = (category: string) => {
  const names: { [key: string]: string } = {
    sleep_recovery: "Sleep & Recovery",
    social_relationships: "Relationships",
    health_wellness: "Health & Wellness",
    work_boundaries: "Work Boundaries",
    personal_growth: "Personal Growth",
    financial_stress: "Financial Wellness"
  };
  return names[category] || category;
};

export const processChartData = (trendData: any[]) => {
  // Daily averages for trend chart
  const dailyAverages = trendData.reduce((acc: any, curr) => {
    if (!acc[curr.date]) {
      acc[curr.date] = { date: curr.date, totalScore: 0, count: 0 };
    }
    acc[curr.date].totalScore += curr.score;
    acc[curr.date].count += 1;
    return acc;
  }, {});

  return Object.values(dailyAverages).map((day: any) => ({
    date: day.date,
    score: Math.round((day.totalScore / day.count) * 10) / 10
  })).slice(-14); // Last 14 days
};
