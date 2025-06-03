
import '../../globals.css'
import Loader from '@/components/shared/Loader'
import { useGetRecentPostsMutation } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import PostCard from '@/components/shared/PostCard'
const Home = () => {

  const { data: posts, isLoading: isPostLoading } = useGetRecentPostsMutation()




  return (
    <div className='flex flex-1 overflow-hidden '>

      <div className='home-container  '>

        <div className='home-post w-full '>
          <h2 className='h3-bold md:h2-bold text-left w-full mb-2 '>Home feed</h2>

          {isPostLoading && !posts ? (

            <div className='text-center w-full mx-auto flex justify-center'>
              <Loader />
            </div>
          ) : (
            <ul className='flex flex-col flex-1 items-center overflow-hidden gap-9 w-full'>
              {posts?.documents.map((post: Models.Document) => {
                return (
                  <li key={post.$id } className='w-full flex justify-center'>

                    <PostCard post={post} />
                  </li>
                )
              })}
            </ul>
          )}



        </div>

      </div>

    </div>
  )
}

export default Home