'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getQuiz } from '@/lib/actions';
import type { Exam } from '@/lib/types';
import type { WeakTopicQuizOutput } from '@/ai/flows/weak-topic-quiz-generator';
import QuizView from './quiz-view';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Please enter a topic for the quiz.',
  }),
});

interface QuizGeneratorProps {
  selectedExam: Exam | undefined;
  selectedGradeId: string;
}

export default function QuizGenerator({ selectedExam, selectedGradeId }: QuizGeneratorProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [quiz, setQuiz] = useState<WeakTopicQuizOutput | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedExam) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a target exam first.",
      });
      return;
    }

    setIsLoading(true);
    const input = {
      topic: values.topic,
      gradeLevel: `Grade ${selectedGradeId}`,
      examType: selectedExam.name,
      numberOfQuestions: 5,
    };

    const result = await getQuiz(input);
    setIsLoading(false);
    setIsFormOpen(false);

    if (result.success && result.quiz) {
      setQuiz(result.quiz);
      setIsQuizOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Quiz Generation Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  }
  
  const handleQuizClose = () => {
    setIsQuizOpen(false);
    setQuiz(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" />
          AI Practice Quiz
        </CardTitle>
        <CardDescription>
          Generate a short quiz on any topic to test your knowledge.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" disabled={!selectedExam}>
              Generate Practice Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate Practice Quiz</DialogTitle>
              <DialogDescription>
                Enter a topic to generate a 5-question quiz.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Photosynthesis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Quiz
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {quiz && (
          <Dialog open={isQuizOpen} onOpenChange={handleQuizClose}>
            <DialogContent className="sm:max-w-xl">
              <QuizView quiz={quiz} onFinish={handleQuizClose} />
            </DialogContent>
          </Dialog>
        )}

      </CardContent>
    </Card>
  );
}
