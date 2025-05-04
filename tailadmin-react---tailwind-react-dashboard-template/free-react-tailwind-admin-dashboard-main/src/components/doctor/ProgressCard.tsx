import { Card, CardContent } from "../ui/card/Card";
import { Flame } from "lucide-react";
import { Progress } from "../ui/progress/Progress";

const ProgressCard = ({ weightLost, goal }) => {
  const progress = (weightLost / goal) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Progression</h2>
          <Flame className="text-orange-500" />
        </div>
        <p className="text-gray-600 mb-2">Poids perdu : {weightLost} kg</p>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground">{progress.toFixed(1)}% de votre objectif atteint</p>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
