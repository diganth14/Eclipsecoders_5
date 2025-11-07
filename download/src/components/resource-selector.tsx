'use client';

import type { Grade, Exam } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookMarked, Target } from 'lucide-react';

interface ResourceSelectorProps {
  grades: Grade[];
  exams: Exam[];
  selectedGradeId: string;
  selectedExamId?: string;
  onGradeChange: (gradeId: string) => void;
  onExamChange: (examId: string) => void;
}

export default function ResourceSelector({
  grades,
  exams,
  selectedGradeId,
  selectedExamId,
  onGradeChange,
  onExamChange,
}: ResourceSelectorProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Select Grade</CardTitle>
          <BookMarked className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Select value={selectedGradeId} onValueChange={onGradeChange}>
            <SelectTrigger aria-label="Select grade">
              <SelectValue placeholder="Select your grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={grade.id.toString()}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Target Exam</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Select value={selectedExamId} onValueChange={onExamChange} disabled={!exams.length}>
            <SelectTrigger aria-label="Select exam">
              <SelectValue placeholder="Select your target exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </>
  );
}
