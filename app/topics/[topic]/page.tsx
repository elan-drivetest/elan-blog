import { getPostsByTopic, getAllTopics } from '@/app/lib/posts';
import { BlogCard } from '@/app/components/ui/BlogCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';

interface Props {
  params: { topic: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Convert hyphens back to spaces
  const topicParam = params.topic.replace(/-/g, ' ');
  
  // Find the exact topic for title
  const allTopics = await getAllTopics();
  const exactTopic = allTopics.find(
    topic => topic.toLowerCase() === topicParam.toLowerCase()
  );
  
  const topicTitle = exactTopic || topicParam;
  
  return {
    title: `${topicTitle} - Elan`,
    description: `Browse all ${topicTitle} articles on Elan`,
  };
}

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map((topic) => ({
    topic: topic.toLowerCase().replace(/ /g, '-'),
  }));
}

export default async function TopicPage({ params }: Props) {
  // Convert hyphens back to spaces for comparison
  const topicParam = params.topic.replace(/-/g, ' ');
  
  // Find the exact topic with correct case
  const allTopics = await getAllTopics();
  const exactTopic = allTopics.find(
    topic => topic.toLowerCase() === topicParam.toLowerCase()
  );
  
  // If we can't find the topic, return 404
  if (!exactTopic) {
    notFound();
  }
  
  const posts = await getPostsByTopic(exactTopic);

  if (posts.length === 0) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": `${exactTopic} Articles - Elan DriveTest Blog`,
    "description": `Browse all articles related to ${exactTopic} on Elan DriveTest Blog`,
    "url": `https://blog.elanroadtestrental.ca/topics/${exactTopic.toLowerCase().replace(/ /g, '-')}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://blog.elanroadtestrental.ca/posts/${post.id}`,
        "name": post.title
      }))
    }
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{exactTopic}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard
              key={post.id}
              title={post.title}
              date={post.date}
              image={post.ogImage}
              slug={post.id}
              preview={post.description}
            />
          ))}
        </div>
      </div>
    </>
  );
}