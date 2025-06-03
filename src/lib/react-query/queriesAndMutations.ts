import { INewPost, INewUser, IUpdatePost } from '@/type'
import {
  //QueryClient,
  //QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  //useInfiniteQuery
} from '@tanstack/react-query'

import { createPost, createUserAccount, deleteSavedPost, getRecentPost, likePost, savePost, signInAccount, signOutAccout, getCurrentUser, getPostById, updatePost, deletePost, getUserPosts, getInfinitePosts, searchPost, getAllUsers, getSavedPosts, givingFollow, isAlreadyFollowing, getUserById, getFollowInfo, givingUnfollow, getFollowerInfo } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'
import { useId } from 'react'

//useMutation: For handling create, update, or delete actions on the server.

//for register
export const useCreateUserAccoutMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user)
  })
}


//for login
export const useSignInAccoutMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string, password: string }) => signInAccount(user)
  })
}

//for logout
export const useSignOutAccoutMutation = () => {
  return useMutation({
    mutationFn: () => signOutAccout()
  })
}


//for create post
export const useCreatePostMutation = () => {

  //we use QueryClient to invalidate the cache so the post will not be shown in home page from cache rather from the server each time
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      //we move queryKeys to other file because it is good practice in large projects
      QueryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
    }
  })
}

//get the posts

export const useGetRecentPostsMutation = () => {
  //we use query not mutation to get the data
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPost
  })
}



//Like a post

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, likesArray }: { postId: string, likesArray: string[] }) => likePost(postId, likesArray),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    }
  })
}



// save post in db
export const useSavePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};



//delete the saved post

export const useDeleteSavedPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};


//get the current user
export const useGetCurrentUserMutation = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

//get the post data to show/edit
export const useGetPostByIDMutation = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  })
}


//update post

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: (post: IUpdatePost) => updatePost(post),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],

      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
    }
  })
}

//delete post
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: ({ postId, imageId }: { postId: string, imageId: string }) => deletePost(postId, imageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
    }
  })
}


//get user posts

export const useGetUserPostsMutation = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId
  })
}

//get user info by id

export const useGetUserByIdMutation = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId
  })
}


//get infinitue post

export const useGetInfinitePostsMutation = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    initialPageParam: null, //  important!
    getNextPageParam: (lastPage: any) => {
      if (!lastPage || lastPage.documents.length === 0) {
        return null;
      }

      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
}

export const useSearchPostsMutation = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPost(searchTerm),
    enabled: !!searchTerm, //automatically enabled when searchTerm changes
  });
};


///get all users

export const useGetAllUsersMutation = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: getAllUsers
  })
}

//get saved posts

export const useGetSavedPostsMutation = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, userId],
    queryFn: () => getSavedPosts(userId),
    enabled: !!userId, // Don't run if no userId

  })
}

// giving a follow

export const useGiveFollowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId } : { followerId: string; followingId: string }) => givingFollow(followerId, followingId),
    onSuccess: (_, { followerId, followingId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOWERS, followingId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOWING, followerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOW_INFO, followingId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.IS_ALREADY_FOLLOWING, followerId, followingId] });
    },
  });
};


//unfollowing

export const useGiveUnFollowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId } : { followerId: string; followingId: string }) => givingUnfollow(followerId, followingId),
    onSuccess: (_, { followerId, followingId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOWERS, followingId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOWING, followerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FOLLOW_INFO, followingId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.IS_ALREADY_FOLLOWING, followerId, followingId] });
    },
  });
};


export const useIsAlreadyFollowingMutation = (userId: string, followingId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.IS_ALREADY_FOLLOWING, userId, followingId],
    queryFn: () => isAlreadyFollowing(userId, followingId),
    enabled: !!userId && !!followingId
  })
}




//get follow info

export const useGetFollowInfoMutation = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOW_INFO, userId],
    queryFn: () => getFollowInfo(userId),
    enabled: !!userId,
    staleTime: 0, // Optional: disables caching completely
  })
}


