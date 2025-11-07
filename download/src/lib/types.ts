export type ResourceType = 'YouTube' | 'PDF' | 'Past Paper';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  topic: string;
  difficulty: Difficulty;
  url: string;
  gradeId: number;
  examIds: string[];
  imageId: string;
}

export interface SubjectWeightage {
  subject: string;
  weightage: number;
}

export interface Exam {
  id: string;
  name: string;
  gradeIds: number[];
  subjectWeightage: SubjectWeightage[];
}

export interface Grade {
  id: number;
  name: string;
}
