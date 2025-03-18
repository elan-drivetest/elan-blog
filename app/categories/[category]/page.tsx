import { getPostsByCategory, getAllCategories } from '@/app/lib/posts';
import { BlogCard } from '@/app/components/ui/BlogCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';

interface Props {
  params: { category: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  return {
    title: `${category} - Elan`,
    description: `Browse all ${category} articles on Elan`,
  };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category.toLowerCase()),
  }));
}

export default async function CategoryPage({ params }: Props) {
  // Properly decode the URL parameter
  const category = decodeURIComponent(params.category);
  
  // Fetch posts with case-insensitive matching
  const allCategories = await getAllCategories();
  
  // Find the correct case version of the category
  const exactCategory = allCategories.find(
    cat => cat.toLowerCase() === category.toLowerCase()
  );
  
  // If we can't find the category, return 404
  if (!exactCategory) {
    notFound();
  }
  
  // Use the exact case version to get posts
  const posts = await getPostsByCategory(exactCategory);

  if (posts.length === 0) {
    notFound();
  }

  // Create structured data for the category page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": `${exactCategory} Articles - Elan DriveTest Blog`,
    "description": `Browse all articles related to ${exactCategory} on Elan DriveTest Blog`,
    "url": `https://blog.elandrivetestrental.ca/categories/${encodeURIComponent(exactCategory.toLowerCase())}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://blog.elandrivetestrental.ca/posts/${post.id}`,
        "name": post.title
      }))
    }
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{exactCategory}</h1>
        
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