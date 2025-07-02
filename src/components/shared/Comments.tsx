import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Send, XIcon, Delete } from 'lucide-react';
import { useAuthContext } from '@/Context/AuthContext';
import { toggleReactionToCommentMutation, useAddNewCommentMutation, useAddNewReplyMutation, useGetAllComments } from '@/lib/react-query/queriesAndMutations';
import Loader from './Loader';
import { set } from 'react-hook-form';
import { Models } from "appwrite";
import { IComment } from '@/type';
import { useNavigate } from 'react-router-dom';
import { checkIsLiked, multiFormatDateString } from '@/lib/utils';

type CommentProps = {
  postId: string;
  allComments: Models.Document[];
  isAllCommentLoading: boolean;
}

const Comments = ({ postId }: { postId: string }) => {
  const navigate = useNavigate();
  const { setShowComment, user } = useAuthContext()

  const { mutateAsync: addNewComment, isPending: isCommentUploading } = useAddNewCommentMutation()

  const { data: allComments, isLoading: isAllCommentLoading } = useGetAllComments(postId)

  const { mutateAsync: addNewReply, isPending: isAddingNewReply } = useAddNewReplyMutation()

  const { mutateAsync: toggleReactionToComment, isPending: isTogglingReaction } = toggleReactionToCommentMutation()



  // console.log(allComments)

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [togglingCommentId, setTogglingCommentId] = useState<string | null>(null);

  const [toggleReply, setToggleReply] = useState<string | null>(null)

  const [isHovering , setIsHovering] = useState<string | null>(null)




  const addComment = async () => {
    if (newComment.trim()) {

      const comment = {
        text: newComment,
        userId: user?.id,
        postId: postId,
      }

      await addNewComment(comment)

      // setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const addReply = async (commentId: string) => {
    if (replyText.trim()) {
      const comment = {
        text: replyText,
        userId: user?.id,
        postId: postId,
      }

      const parentCommentId = commentId

      await addNewReply({ comment, parentCommentId })

      setReplyText('');
      setReplyingTo(null);
    }
  };

  const toggleLike = async (commentId: string) => {
    setTogglingCommentId(commentId)
    await toggleReactionToComment({ commentId, userId: user?.id })
    setTogglingCommentId(null)
  };

  const formatText = (text: string) => {
    if (!text) return
    return text.split(' ').map((word, index) => {
      if (word.startsWith('@')) {
        return <span key={index} className="text-blue-400 font-bold hover:text-blue-300 cursor-pointer">{word} </span>;
      }
      if (word.startsWith('#')) {
        return <span key={index} className="text-blue-400 font-bold hover:text-blue-300 cursor-pointer">{word} </span>;
      }
      return word + ' ';
    });
  };


  const getParentCommentUser = (commentID: string) => {
    // console.log(commentID)
    if (!allComments) return
    if (!commentID) return

    let usr = {username : ''}
    const comment = allComments?.find(({ comment }) => {

      if (comment.$id === commentID) {
        usr = comment.creator
        return
      }
      else {
        comment.replies.find((reply: any) => {
          if (reply.$id === commentID) {
            usr = reply.creator
            return
          }
        })
      }
    }
    )

    if (usr) {
      console.log(usr)
      return usr;
    }

  }

  return (
    <div className=" overflow-auto max-w-lg  mx-auto bg-zinc-950 border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-sm flex flex-col justify-around">
      <div className=' md:min-w-[30rem]'>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white">Comments</h2>
          <XIcon
            className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            onClick={() => setShowComment(false)}
          />
        </div>

        {/* Comments List */}
        {
          isAllCommentLoading ? (
            <div className='flex justify-center w-full md:min-h-72 items-center'>
              <Loader />
            </div>
          ) : (
            <div className=" max-h-96 md:min-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {
                allComments?.length === 0 && (
                  <p className='w-full h-72 flex justify-center items-center text-gray-400/50 text-sm font-semibold'>No comments yet</p>
                )
              }
              {allComments?.map(({ comment }: { comment: Models.Document }) => (

                // console.log(comment),
                <div 
                  key={comment.$id} className="p-5 border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                  onMouseOver={() => setIsHovering(comment.$id)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  {/* Main Comment */}
                  <div className="flex space-x-4">
                    <div className="relative">
                      <img
                        src={comment.creator.imageUrl}
                        alt={comment.creator.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700/50 cursor-pointer"
                        onClick={() => navigate(`/profile/${comment.creator.$id}`)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-bold text-sm text-white">{comment.creator.username}</span>
                          <span className="text-gray-400 text-xs ml-2 font-medium">{multiFormatDateString(comment.$createdAt)}</span>
                          <p className="text-sm text-gray-200 mt-2 leading-relaxed">

                            {formatText(comment.comment)}</p>
                        </div>
                        <button
                          onClick={() => toggleLike(comment.$id)}
                          className="ml-3 flex flex-col gap-2 flex-shrink-0 items-center    "
                        >

                          {togglingCommentId === comment.$id ? (
                            <Loader />
                          ) : (
                            <Heart
                              className={`w-6 h-6 p-1 rounded-full hover:bg-gray-700/50 transition-all duration-200 ${checkIsLiked(comment.reactionIDs, user.id) ? 'fill-red text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'}`}
                            />
                          )}


                          {comment.reactionIDs.length > 0 && (
                            <span className="text-xs text-gray-300 font-bold">
                              {comment.reactionIDs.length} {comment.reactionIDs.length === 1 ? 'like' : 'likes'}
                            </span>
                          )}
                        </button>
                      </div>


                      {/* Comment Actions : telling how many likes and a reply button */}
                      <div className="flex items-center space-x-6 mt-3 ">

                        {
                          comment.replies.length > 0 && (
                            <span
                              className='text-xs text-gray-400 font-bold hover:text-white transition-colors cursor-pointer'
                              onClick={() => setToggleReply(toggleReply === comment.$id ? null : comment.$id)}
                            >

                              {toggleReply === comment.$id ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                            </span>
                          )
                        }

                        <button
                          onClick={() => setReplyingTo(replyingTo === comment?.$id ? null : comment.$id)}
                          className="text-xs text-gray-400 font-bold hover:text-white transition-colors"
                        >
                          Reply
                        </button>

                        {
                          comment.creator.$id === user.id && (
                            <button
                              className={`${isHovering == comment.$id ? 'bg-opacity-65 hover:opacity-100' : 'opacity-0'}  transition-opacity duration-300`}
                              
                            >
                              <img
                                src={"/assets/icons/delete.svg"}
                                alt="delete"
                                width={15}
                                height={15}
                              />

                            </button>
                          )
                        }
                      </div>

                      {/* Reply to a comment */}
                      {replyingTo === comment.$id && (
                        <div className="flex items-center space-x-3 mt-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                          <img
                            src={user?.imageUrl}
                            alt="Your avatar"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50"
                          />
                          <input
                            type="text"
                            placeholder={`Reply to ${comment.creator.username}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addReply(comment.$id)}
                            className="flex-1 text-sm border-none outline-none bg-gray-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-2 focus:bg-gray-700 transition-colors"
                          />
                          <button
                            onClick={() => addReply(comment.$id)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-500/20 transition-all"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies.length > 0 && toggleReply == comment.$id && (
                        // console.log(comment.replies),
                        <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-700/50">
                          {comment?.replies?.map((reply: Models.Document) => (
                            // console.log(reply),
                            <div key={reply.$id} className="flex space-x-3 p-3 bg-gray-800/30 rounded-xl">
                              <div className="relative">
                                <img
                                  src={reply?.creator?.imageUrl}
                                  alt={reply?.creator?.username}
                                  className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-600/50"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <span className="font-bold text-sm text-white">{reply.creator.username}</span>
                                    <span className="text-gray-400 text-xs ml-2 font-medium">{multiFormatDateString(reply?.$createdAt)}</span>

                                    <p className="text-sm text-gray-200 mt-1.5 leading-relaxed">
                                      <span className='mr-2 text-xs text-light-3'>@ {getParentCommentUser(reply.parentCommentIDs[reply.parentCommentIDs.length - 1])?.username}</span>
                                      {formatText(reply.comment)}</p>
                                  </div>
                                  <button
                                    onClick={() => toggleLike(reply.$id)}
                                    className="ml-3 flex flex-col gap-2 flex-shrink-0 items-center    "
                                  >
                                    {togglingCommentId === reply.$id ? (
                                      <Loader />
                                    ) : (
                                      <Heart
                                        className={`w-6 h-6 p-1 rounded-full hover:bg-gray-700/50 transition-all duration-200 ${checkIsLiked(reply.reactionIDs, user.id) ? 'fill-red text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'}`}
                                      />
                                    )}
                                    {reply.reactionIDs.length > 0 && (
                                      <span className="text-xs text-gray-300 font-bold">
                                        {reply.reactionIDs.length} {reply.reactionIDs.length === 1 ? 'like' : 'likes'}
                                      </span>
                                    )}
                                  </button>
                                </div>

                                {/* Reply Actions - Same as main comment */}
                                <div className="flex items-center space-x-6 mt-3">

                                  <button
                                    onClick={() => setReplyingTo(replyingTo === reply.$id ? null : reply.$id)}
                                    className="text-xs text-gray-400 font-bold hover:text-white transition-colors"
                                  >
                                    Reply
                                  </button>
                                </div>

                                {/* Reply to Reply Input */}
                                {replyingTo === reply.$id && (
                                  <div className="flex items-center space-x-3 mt-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                    <img
                                      src={user?.imageUrl}
                                      alt="Your avatar"
                                      className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50"
                                    />
                                    <input
                                      type="text"
                                      placeholder={`Reply to ${reply.creator.username}...`}
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && addReply(reply.$id)}
                                      className="flex-1 text-sm border-none outline-none bg-gray-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-2 focus:bg-gray-700 transition-colors"
                                    />
                                    <button
                                      onClick={() => addReply(reply.$id)}
                                      className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-500/20 transition-all"
                                    >
                                      <Send className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>

      {/* Add Comment Input */}
      <div className="p-5 border-t  border-gray-700/50 bg-gray-800/20 ">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user?.imageUrl}
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComment()}
            className="flex-1 text-sm border-none outline-none bg-gray-700/50 text-white placeholder-gray-400 rounded-2xl px-5 py-3 focus:bg-gray-700 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button
            onClick={addComment}
            disabled={!newComment.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${newComment.trim()
              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 bg-blue-500/10'
              : 'text-gray-500 cursor-not-allowed'
              }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;