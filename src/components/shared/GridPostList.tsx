import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { useAuthContext } from "@/Context/AuthContext";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useAuthContext();

  return (
    <ul className="grid-container ">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80 pr-4  overflow-hidden">
          <Link to={`/PostDetails/${post.$id}`} className="grid-post_link">
            {post.imageUrl ? (<img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover hover:scale-105 duration-300"
            />) : (
              <div className="small-medium lg:base-medium py-5 ">

                {post?.Caption}

                <ul className="flex gap-1 mt-2">
                  {post?.tags?.map((tag: string) => {
                    return (
                      <li className="text-light-3" key={tag}>
                        #{tag + ''}
                      </li>
                    )
                  })}
                </ul>

              </div>
            )}

          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1 ">
                <img
                  src={
                    post.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full "
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;