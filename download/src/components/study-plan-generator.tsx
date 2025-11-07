'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BrainCircuit, Loader2 } from 'lucide-react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getStudyPlan } from '@/lib/actions';
import type { Exam } from '@/lib/types';

const formSchema = z.object({
  weakAreas: z.string().min(3, {
    message: 'Please enter at least one area of weakness.',
  }),
});

interface StudyPlanGeneratorProps {
    selectedExam: Exam | undefined;
    selectedGradeId: string;
}

export default function StudyPlanGenerator({ selectedExam, selectedGradeId }: StudyPlanGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weakAreas: '',
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
    setStudyPlan(null);

    const input = {
      grade: `Grade ${selectedGradeId}`,
      targetExam: selectedExam.name,
      weakAreas: values.weakAreas.split(',').map(s => s.trim()),
    };

    const result = await getStudyPlan(input);
    setIsLoading(false);

    if (result.success && result.plan) {
      setStudyPlan(result.plan);
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'An unknown error occurred.',
      });
      setIsOpen(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-accent" />
          AI Study Planner
        </CardTitle>
        <CardDescription>
          Get a personalized study plan based on your weak areas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!selectedExam}>
              Generate Your Study Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate Personalized Study Plan</DialogTitle>
              <DialogDescription>
                Enter your areas of weakness, separated by commas. Our AI will
                create a plan to help you improve.
              </DialogDescription>
            </DialogHeader>
            {!studyPlan && !isLoading && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="weakAreas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weak Topics/Subjects</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Trigonometry, Organic Chemistry"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific for the best results.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Generate Plan</Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is crafting your plan...</p>
              </div>
            )}
            {studyPlan && (
              <div className="prose prose-sm max-h-[50vh] overflow-y-auto rounded-md border bg-secondary/50 p-4">
                <h3 className='font-headline'>Your Personalized Plan</h3>
                <pre className="whitespace-pre-wrap font-body text-sm">{studyPlan}</pre>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
