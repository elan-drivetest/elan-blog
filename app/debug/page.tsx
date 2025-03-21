// app/debug/page.tsx
import { getAllCategories } from '@/app/lib/posts';

export default async function DebugPage() {
  const categories = await getAllCategories();
  
  return (
    <div>
      <h1>All Categories</h1>
      <ul>
        {categories.map(category => (
          <li key={category}>
            {category} - <small>(lowercase: {category.toLowerCase()})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}