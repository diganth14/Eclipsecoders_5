import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Resource } from '@/lib/types';
import ResourceCard from './resource-card';

interface ResourceTabsProps {
  resources: Resource[];
}

export default function ResourceTabs({ resources }: ResourceTabsProps) {
  const youtubeResources = resources.filter((r) => r.type === 'YouTube');
  const pdfResources = resources.filter((r) => r.type === 'PDF');
  const paperResources = resources.filter((r) => r.type === 'Past Paper');

  const renderResourceGrid = (res: Resource[]) => {
    if (res.length === 0) {
      return <p className="p-4 text-muted-foreground">No resources available for this selection.</p>;
    }
    return (
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {res.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Curated Learning Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="papers">Past Papers</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {renderResourceGrid(resources)}
          </TabsContent>
          <TabsContent value="youtube" className="mt-4">
            {renderResourceGrid(youtubeResources)}
          </TabsContent>
          <TabsContent value="notes" className="mt-4">
            {renderResourceGrid(pdfResources)}
          </TabsContent>
          <TabsContent value="papers" className="mt-4">
            {renderResourceGrid(paperResources)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
