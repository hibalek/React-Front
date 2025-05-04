// src/components/ActivityCard.tsx

import { Card, CardContent } from "../ui/card/Card"
import { Activity } from "lucide-react"

type ActivityCardProps = {
  activeDays: number
  weeklyGoals: string
}

const ActivityCard = ({ activeDays, weeklyGoals }: ActivityCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Activité</h2>
          <Activity className="text-green-600" />
        </div>
        <p>Jours actifs : <strong>{activeDays}</strong></p>
        <p>Objectifs hebdomadaires atteints : <strong>{weeklyGoals}</strong></p>
      </CardContent>
    </Card>
  )
}

export default ActivityCard
