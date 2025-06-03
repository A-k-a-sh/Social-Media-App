import { Models } from 'appwrite'
import Loader from './Loader'
import GridPostList from './GridPostList'

type searchResultProps = {
  isSearchFetching : boolean
  searchedPosts : Models.Document[]
}

const SearchResults = ({isSearchFetching , searchedPosts} : searchResultProps) => {
  if(isSearchFetching){
    return <div className='flex-center w-full h-full'>
      <Loader />
    </div>
  }

  if(searchedPosts && searchedPosts.length > 0){
    return (
      <div>
        <GridPostList posts={searchedPosts} />
      </div>
    )
  }
  return (
    
      <p className='text-light-4 mt-10 text-center w-full '>No results found</p>
    
  )
}

export default SearchResults