'use client';

import { useState, useMemo } from 'react';
import { exams, grades, resources } from '@/lib/data';
import type { Exam, Resource } from '@/lib/types';
import ResourceSelector from '@/components/resource-selector';
import ExamWeightage from '@/components/exam-weightage';
import ResourceTabs from '@/components/resource-tabs';
import StudyPlanGenerator from '@/components/study-plan-generator';
import QuizGenerator from './quiz-generator';

export default function Dashboard() {
  const [selectedGradeId, setSelectedGradeId] = useState<string>(
    grades[0].id.toString()
  );
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(
    exams.find(e => e.gradeIds.includes(parseInt(selectedGradeId, 10)))?.id
  );

  const handleGradeChange = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    const numericGradeId = parseInt(gradeId, 10);
    const firstMatchingExam = exams.find(e => e.gradeIds.includes(numericGradeId));
    setSelectedExamId(firstMatchingExam?.id);
  };

  const filteredExams = useMemo(() => {
    const numericGradeId = parseInt(selectedGradeId, 10);
    return exams.filter((exam) => exam.gradeIds.includes(numericGradeId));
  }, [selectedGradeId]);

  const selectedExam: Exam | undefined = useMemo(() => {
    return exams.find((exam) => exam.id === selectedExamId);
  }, [selectedExamId]);

  const filteredResources: Resource[] = useMemo(() => {
    if (!selectedExamId) return [];
    const numericGradeId = parseInt(selectedGradeId, 10);
    return resources.filter(
      (resource) =>
        resource.gradeId === numericGradeId &&
        resource.examIds.includes(selectedExamId)
    );
  }, [selectedGradeId, selectedExamId]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ResourceSelector
          grades={grades}
          exams={filteredExams}
          selectedGradeId={selectedGradeId}
          selectedExamId={selectedExamId}
          onGradeChange={handleGradeChange}
          onExamChange={setSelectedExamId}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ExamWeightage data={selectedExam?.subjectWeightage ?? []} />
          <ResourceTabs resources={filteredResources} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <StudyPlanGenerator selectedExam={selectedExam} selectedGradeId={selectedGradeId} />
          <QuizGenerator selectedExam={selectedExam} selectedGradeId={selectedGradeId} />
        </div>
      </div>
    </>
  );
}
