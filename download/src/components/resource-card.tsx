import Image from 'next/image';
import { Youtube, FileText, Newspaper, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Resource } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ResourceCardProps {
  resource: Resource;
}

const typeIcons = {
  YouTube: <Youtube className="h-5 w-5" />,
  PDF: <FileText className="h-5 w-5" />,
  'Past Paper': <Newspaper className="h-5 w-5" />,
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  const imageData = PlaceHolderImages.find((img) => img.id === resource.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="relative h-48 w-full p-0">
        {imageData && (
            <Image
            src={imageData.imageUrl}
            alt={imageData.description}
            fill
            className="object-cover"
            data-ai-hint={imageData.imageHint}
            />
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="mb-2 flex items-center justify-between">
            <CardTitle className="text-lg font-headline leading-tight">
            {resource.title}
            </CardTitle>
            <div className="text-muted-foreground">{typeIcons[resource.type]}</div>
        </div>
        <p className="text-sm text-muted-foreground">{resource.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{resource.topic}</Badge>
          <Badge variant="outline">{resource.difficulty}</Badge>
        </div>
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          <ArrowUpRight className="h-5 w-5" />
          <span className="sr-only">Open resource</span>
        </a>
      </CardFooter>
    </Card>
  );
}
