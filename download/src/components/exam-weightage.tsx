'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { SubjectWeightage } from '@/lib/types';
import type { ChartConfig } from '@/components/ui/chart';

interface ExamWeightageProps {
  data: SubjectWeightage[];
}

const chartConfig = {
  weightage: {
    label: "Weightage",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ExamWeightage({ data }: ExamWeightageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Exam Subject Weightage</CardTitle>
        <CardDescription>
          Percentage distribution of subjects for the selected exam.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} accessibilityLayer>
              <XAxis
                dataKey="subject"
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
               <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="weightage"
                fill="var(--color-weightage)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Select an exam to see subject weightage.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
