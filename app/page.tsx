import { type PostData, getSortedPostsData } from "./lib/posts";
import Sidebar from "./components/wrappers/Sidebar";
import InfiniteScrollPosts from "./components/ui/InfiniteScrollPosts";

export default async function Home() {
  console.log('Starting Home page render');
  let allPostsData: PostData[] = [];
  
  try {
    allPostsData = await getSortedPostsData();
    console.log('Posts received:', allPostsData);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <InfiniteScrollPosts posts={allPostsData} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}