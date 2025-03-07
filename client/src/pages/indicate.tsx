import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndicationForm } from "@/components/indication/indication-form";

export default function Indicate() {
  return (
    <div className="container p-4 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Nova Indicação</CardTitle>
        </CardHeader>
        <CardContent>
          <IndicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
