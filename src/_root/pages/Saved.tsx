import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import { useAuthContext } from '@/Context/AuthContext'
import { useGetSavedPostsMutation } from '@/lib/react-query/queriesAndMutations'

const Saved = () => {
  const { user: currentUser } = useAuthContext()

  if (!currentUser) return (
    <div className='flex justify-center w-full h-full items-center'>
      <Loader />
    </div>
  )

  const { data: savedPosts, isPending: isSavedPostsLoading } = useGetSavedPostsMutation(currentUser.id)

  if (isSavedPostsLoading) return (
    <div className='flex justify-center w-full h-full items-center'>
      <Loader />
    </div>
  )

  const posts = savedPosts?.documents.map((item) => item.posts) ?? [];

if(posts.length === 0){
  return (
    <div className='flex justify-center w-full h-full items-center'>
      <p className='text-light-4 mt-10 text-center w-full '>No saved posts found</p>
    </div>
  )
}

  return (
    <div className='saved-container'>
      <h2 className='h3-bold md:h2-bold text-left w-full mb-2 '>Your Saved Posts</h2>

      <div>

        <GridPostList
          posts={posts}
          showStats={false}
          showUser={false}
        />
      </div>
    </div>
  )
}

export default Saved