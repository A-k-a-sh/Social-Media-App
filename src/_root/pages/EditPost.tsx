import PostForm from '@/components/forms/PostForm'
import { useGetPostByIDMutation } from '@/lib/react-query/queriesAndMutations'
import { Loader } from 'lucide-react'
import { useParams } from 'react-router-dom'
const EditPost = () => {
  const { postId : id } = useParams()

  const {data : post , isPending } = useGetPostByIDMutation(id || '')

  if(isPending) return (
    <div className='flex justify-center w-full h-full items-center'>
      <Loader />
    </div>
  )

  return (
    <div className='flex flex-1 '>
      <div className='common-container '>
        <div className='max-w-5xl flex justify-start items-center gap-3 w-full'>
          <img src="/assets/icons/add-post.svg"
           alt=""
           width={36}
           height={36}
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Post</h2>
        </div>

       <PostForm action="Update" post={post} />

      </div>
    </div>
  )
}

export default EditPost