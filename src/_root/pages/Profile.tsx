import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/Context/AuthContext";
import { useGetFollowInfoMutation, useGetUserByIdMutation, useGiveFollowMutation, useGiveUnFollowMutation, useIsAlreadyFollowingMutation } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useState } from "react";
import { useParams } from "react-router-dom"
import AllUsers from "./AllUsers";

function Profile() {
  const { userId } = useParams();
  const [select, setSelect] = useState(1);


  const { user: currentUser } = useAuthContext()



  const { mutateAsync: giveFollow, isPending: isGiveFollowLoading } = useGiveFollowMutation()

  const { data: isAlreadyFollowing } = useIsAlreadyFollowingMutation(currentUser.id, userId as string)

  const { data: followInfo, isLoading: isFollowInfoLoading } = useGetFollowInfoMutation(userId || '')

  const { mutateAsync: giveUnfollow, isPending: isGiveUnfollowLoading } = useGiveUnFollowMutation()


  console.log(followInfo)



  const { data: userInfo, isLoading: isUserLoading } = useGetUserByIdMutation(userId as string)

  if (!userId || !currentUser?.id) {
    return <div className="flex justify-center w-full mt-28">
      <Loader />
    </div>
  }
  if (isUserLoading || isFollowInfoLoading) {
    return <div className="flex justify-center w-full mt-28">
      <Loader />
    </div>
  }



  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">

      <div className="flex  flex-col  gap-4  md:flex-row w-full">
        <img
          src={userInfo?.imageUrl || '/assets/images/avatar/1.jpg'}
          alt=""
          className="rounded-full w-28 h-28"
        />

        <div className="flex flex-1 flex-col gap-4 md:flex-row justify-between  ">
          <div className="flex flex-col gap-2">
            <h2 className="h2-bold text-left">{userInfo?.name}</h2>
            <p className="text-light-4">@{userInfo?.username}</p>
            <div className="flex flex-wrap flex-row gap-6   xl:gap-12 font-bold mt-2">
              <p>
                <span className="text-primary-500/80 pr-2">{userInfo?.posts?.length}</span>
                Posts
              </p>
              <p>
                <span className="text-primary-500/80 pr-2">{followInfo?.followerList.documents?.length}</span>
                Followers
              </p>
              <p>
                <span className="text-primary-500/80 pr-2">{followInfo?.followingList.documents?.length}</span>
                Followigs
              </p>
            </div>
          </div>

          {
            userId !== currentUser.id &&

            <div className="">
              {
                isAlreadyFollowing?.documents.length === 0 ? (
                  <Button
                    className="shad-button_primary cursor-pointer w-24 h-12"
                    onClick={() => giveFollow({ followerId: currentUser.id, followingId: userId as string })}
                  >
                    {isGiveFollowLoading ? (<Loader />) : 'follow'}
                  </Button>
                ) : (
                  <Button
                    className="shad-button_dark_4 cursor-pointer w-24 h-6"
                    onClick={() => giveUnfollow({ followerId: currentUser.id, followingId: userId as string })}
                  >
                    {isGiveUnfollowLoading ? (<Loader />) : 'Unfollow'}
                  </Button>
                )

              }

            </div>
          }
        </div>

      </div>

      <div className="w-full mt-10 md:mt-20 ">

        <div className="flex flex-row justify-start gap-4 flex-wrap">

          <div
            className={`flex flex-row gap-3  px-5 py-1 rounded-lg justify-between items-center hover:bg-zinc-700 duration-200 cursor-pointer ${select === 1 ? 'bg-zinc-700' : ' bg-zinc-900'}`}
            onClick={() => setSelect(1)}
          >

            <img
              src="/assets/icons/wallpaper.svg"
              alt="post"
              className="w-6 h-6"
            />
            <p>Posts</p>

          </div>

          <div
            className={`flex flex-row gap-3  px-5 py-1 rounded-lg justify-between items-center hover:bg-zinc-700 duration-200 cursor-pointer ${select === 2 ? 'bg-zinc-700' : ' bg-zinc-900'}`}
            onClick={() => setSelect(2)}
          >

            <img
              src="/assets/icons/people.svg"
              alt="Followers"
              className="w-6 h-6"
            />
            <p>Followers</p>

          </div>

          <div
            className={`flex flex-row gap-3  px-5 py-1 rounded-lg justify-between items-center hover:bg-zinc-700 duration-200 cursor-pointer ${select === 3 ? 'bg-zinc-700' : ' bg-zinc-900'}`}
            onClick={() => setSelect(3)}
          >

            <img
              src="/assets/icons/people.svg"
              alt="Following"
              className="w-6 h-6"
            />
            <p>Following</p>

          </div>

        </div>

        <div className="mt-10">
          {select === 1 && <GridPostList posts={userInfo?.posts || []} showUser={false} showStats={true} />}

          {select === 2 && <AllUsers
            allUsers={followInfo?.followerInfo}
            isGetFromProps={true}
          />}

          {select === 3 && <AllUsers
            allUsers={followInfo?.followingInfo}
            isGetFromProps={true}
          />}

        </div>

      </div>


    </div>
  )
}

export default Profile