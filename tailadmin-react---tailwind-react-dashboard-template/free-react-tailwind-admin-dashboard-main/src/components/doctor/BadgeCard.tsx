// src/components/BadgeCard.tsx

import { Card, CardContent } from "../ui/card/Card"
import { Trophy } from "lucide-react"

type BadgeCardProps = {
  badges: string[] // 👈 on suppose que c'est un tableau de string
}

const BadgeCard = ({ badges }: BadgeCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Badges</h2>
          <Trophy className="text-yellow-500" />
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {badges.map((badge, index) => (
            <li key={index}>{badge}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default BadgeCard
