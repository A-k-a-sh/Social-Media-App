import Loader from '@/components/shared/Loader'
import { useAuthContext } from '@/Context/AuthContext'
import { useGetAllUsersMutation } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'

const AllUsers = ({ allUsers: propAllUsers, isGetFromProps = false }: { allUsers?: Models.Document, isGetFromProps?: boolean }) => {
  const { data: fetchedUsers, isLoading: isFetching } = useGetAllUsersMutation()
  const { user: currentUser } = useAuthContext()

  const allUsers = isGetFromProps ? propAllUsers : fetchedUsers
  const isAllUsersLoading = isGetFromProps ? false : isFetching


  if (isAllUsersLoading) {
    return <div className='mt-16 h-fit w-full flex-center'>
      <Loader />
    </div>
  }


  return (
    <div className={`w-full flex flex-col   overflow-scroll px-4 py-10  custom-scrollbar ${!isGetFromProps && 'md:px-14'}`}>

      {!isGetFromProps &&
        <h2 className='h3-bold md:h2-bold text-left w-full mb-4 '>Find People</h2>
      }
      <div className='user-grid   mx-auto '>

        {
          allUsers?.documents.filter((user: any) =>!isGetFromProps ? user.$id !== currentUser.id : user).map((user: Models.Document, index: number) => (
            <div key={index} className='user-card hover:-translate-y-2 duration-300 '>
              <img
                src={user.imageUrl} alt=""
                className='w-10 h-10 rounded-full'
              />
              <div className='w-full'>
                <h3 className='text-center'>{user.name}</h3>
                <p className='text-light-3 text-center'>@{user.username}</p>
              </div>
              <Link
                to={`/profile/${user.$id}`}
                className='shad-button_primary px-6 py-2 rounded-lg cursor-pointer hover:opacity-90 duration-200'
              >
                View Profile
              </Link>
            </div>
          ))
        }

      </div>
    </div>
  )
}

export default AllUsers