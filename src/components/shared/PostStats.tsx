import { useAuthContext } from "@/Context/AuthContext"
import { useDeleteSavedPostMutation, useGetAllComments, useGetCurrentUserMutation, useLikePostMutation, useSavePostMutation } from "@/lib/react-query/queriesAndMutations"
import { checkIsLiked } from "@/lib/utils"
import { Models } from "appwrite"
import React, { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { MessageCircle } from 'lucide-react';

type PostStatsProps = {
    post: Models.Document
    userId: string
}



const PostStats = ({ post, userId }: PostStatsProps) => {

    const { showComment, setShowComment } = useAuthContext()

    const { data: currentUser } = useGetCurrentUserMutation()


    const navigate = useNavigate()

    // console.log(post)

    const likesList = post.likes.map((user: Models.Document) => user.$id);

    const [likes, setLikes] = useState(likesList)
    const [isSaved, setIsSaved] = useState(false)

    const { mutate: likePost } = useLikePostMutation()
    const { mutate: savePost } = useSavePostMutation()
    const { mutate: deleteSavedPost } = useDeleteSavedPostMutation()




    // const 

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        let newLikes = [...likes]

        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter((id: string) => id !== userId)
        }
        else {
            newLikes.push(userId)
        }
        setLikes(newLikes)

        likePost({ postId: post.$id, likesArray: newLikes })


    }

    const savedPostRecord = currentUser?.save?.find(
        (record: Models.Document) => record?.posts && record.posts.$id === post.$id
    );


    useEffect(() => {
        setIsSaved(!!savedPostRecord);

    }, [currentUser])
    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (savedPostRecord) {

            setIsSaved(false)
            deleteSavedPost(savedPostRecord.$id)
            return
        }

        setIsSaved(true)
        savePost({ userId: userId, postId: post.$id })
    }

    return (
        <div className="flex justify-between items-center z-20">

            <div className="flex  items-center gap-2 mr-5">
                <div className="flex flex-row gap-4 items-center ">
                    <div className="flex flex-row items-center gap-2">
                        <img
                            src={checkIsLiked(likesList, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                            width={20}
                            height={20}
                            onClick={handleLikePost}
                            className="cursor-pointer"
                            alt="like"
                        />
                        <p className="small-medium lg:base-medium">{likes.length}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <MessageCircle
                            width={20}
                            height={20}
                            className="text-violet-400/80 font-bold cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowComment(true)
                                navigate(`/PostDetails/${post.$id}`)
                            }}
                        />

                        <p className="small-medium lg:base-medium">{post?.comments?.length}</p>
                    </div>
                </div>
            </div>
            <div className="flex  items-center gap-2 ">
                <img
                    src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                    width={20}
                    height={20}
                    onClick={handleSavePost}
                    className="cursor-pointer"
                    alt="like"
                />

            </div>
        </div>
    )
}

export default PostStats