// src/components/WeightChart.tsx

import { Card, CardContent } from "../ui/card/Card"
import { CheckCircle } from "lucide-react"
import { Line } from "react-chartjs-2"

type WeightData = {
  labels: string[]
  values: number[]
}

type WeightChartProps = {
  weightData: WeightData
}

const WeightChart = ({ weightData }: WeightChartProps) => {
  const data = {
    labels: weightData.labels,
    datasets: [
      {
        label: "Poids (kg)",
        data: weightData.values,
        borderColor: "#4f46e5",
        tension: 0.4,
      },
    ],
  }

  return (
    <Card className="md:col-span-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Évolution du poids</h2>
          <CheckCircle className="text-blue-500" />
        </div>
        <Line data={data} />
      </CardContent>
    </Card>
  )
}

export default WeightChart
