import { INewPost, INewUser, IUpdatePost } from "@/type"; //just normal type defined in type folder 
import { account, appwriteConfing, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";


export async function createUserAccount(user: INewUser) {

    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDb({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: avatarUrl,
            username: user.username
        })

        if (!newUser) throw Error;
        return newUser;
    } catch (error) {
        console.log(error);
        return error;

    }

}


export async function saveUserToDb(user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl: string,
    username: string
}) {

    try {
        const newUser = await databases.createDocument(
            appwriteConfing.databasesId,
            appwriteConfing.userCollecttionId,
            ID.unique(),
            user
        )
        return newUser;
    }
    catch (error) {
        console.log(error);
    }
}

//Allow the user to login into their account by providing a valid email and password combination. This route will create a new session for the user.

//just creating a session by appwrite
export async function signInAccount(user: { email: string, password: string }) {
    try {

        // await account.deleteSession('current');
        const session = await account.createEmailPasswordSession(user.email, user.password);

        if (!session) throw Error;
        return session


    } catch (error) {
        console.log(error);
    }
}


//get the logged user
export async function getCurrentUser() {
    try {

        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.userCollecttionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}


//sign out
export const signOutAccout = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error);
    }
}


//create post and save it to db

export async function createPost(post: INewPost) {
    let fileUrl = null;
    let uploadedFile = null;
    try {
        //first upload image to stroage
        if (post.file?.length) {
            console.log(post.file.length);
            uploadedFile = await uploadFile(post.file[0]);

            //now atach the image to the post
            if (!uploadedFile) throw Error;
            //Get the file url
            fileUrl = getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                //if file corrupted during upload , then we delete the file from stroage an db
                deleteFile(uploadedFile.$id);
                throw Error; //deletting from the storage hasn't been done yet
            }
        }



        //convert tags into an array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // Create post
        const newPost = await databases.createDocument(
            appwriteConfing.databasesId,
            appwriteConfing.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                Caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile?.$id,
                location: post.location,
                tags: tags
            }
        )

        if (!newPost) {
            if (post.file && uploadedFile?.$id) {
                deleteFile(uploadedFile.$id);
            }
            throw new Error("Failed to create post");
        }


        return newPost


    } catch (error) {
        console.log(error);

    }
}


// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
    let hasFileToUpdate = false;
    if(post.file)hasFileToUpdate = post?.file.length > 0;

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        };

        if (hasFileToUpdate && post.file) {
            // Upload new file to appwrite storage
             const uploadedFile = await uploadFile(post?.file[0]);
            if (!uploadedFile) throw Error;

            // Get new file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        // Convert tags into array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        //  Update post
        const updatedPost = await databases.updateDocument(
            appwriteConfing.databasesId,
            appwriteConfing.postCollectionId,
            post.postId,
            {
                Caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        );

        // Failed to update
        if (!updatedPost) {
            // Delete new file that has been recently uploaded
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }

            // If no new file uploaded, just throw error
            throw Error;
        }

        // Safely delete old file after successful update
        if (hasFileToUpdate) {
            await deleteFile(post.imageId);
        }

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}


// ============================== DELETE POSTS
export async function deletePost(postId?: string, imageId?: string) {
    if (!postId || !imageId) return;

    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfing.databasesId,
            appwriteConfing.postCollectionId,
            postId
        );

        if (!statusCode) throw Error;

        await deleteFile(imageId);

        return { status: "Ok" };
    } catch (error) {
        console.log(error);
    }
}




//in this function we mainly uploading the img file to stroage (not in db)
export async function uploadFile(file: File) {
    if(!file) return null;
    try {

        const uploadedFile = await storage.createFile(
            appwriteConfing.storageId,
            ID.unique(),
            file
        )

        return uploadedFile

    } catch (error) {
        console.log(error);
    }
}


// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFileView(
            appwriteConfing.storageId,
            fileId,
            // 2000,//width
            // 2000,//height
            // ImageGravity.Top, //position
            // 100 //quality
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}


// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfing.storageId, fileId);
    } catch (error) {
        console.log(error);
    }
}


// ============================== GET POST
//fetches all the post from the database

export async function getRecentPost() {
    const posts = await databases.listDocuments(
        appwriteConfing.databasesId,
        appwriteConfing.postCollectionId,
        [
            Query.orderDesc('$createdAt'),
            Query.limit(10)
        ]
    )

    if (!posts) throw Error;

    return posts;
}


// ============================== Liked Post

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfing.databasesId,
            appwriteConfing.postCollectionId,
            postId,
            {
                likes: likesArray
            }

        )

        if (!updatedPost) throw Error;

        return updatedPost
    } catch (error) {
        console.log(error);
    }
}

// ============================== Save saved Post in db
export async function savePost(userId: string, postId: string) {
    try {
        const savedPost = await databases.createDocument(
            appwriteConfing.databasesId,
            // appwriteConfing.savesCollectionId,
            '675fed3d003cbbca8dd4',
            ID.unique(),
            {
                users: userId,
                posts: postId
            }

        )

        if (!savedPost) throw Error;

        return savedPost
    } catch (error) {
        console.log(error);
    }
}

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfing.databasesId,
            appwriteConfing.savesCollectionId,
            savedRecordId
        );

        if (!statusCode) throw Error;

        return { status: "Ok" };
    } catch (error) {
        console.log(error);
    }
}


// ============================== GET POST BY ID
export async function getPostById(postId: string) {
    if (!postId) {
        throw Error
    }

    try {
        const post = await databases.getDocument(
            appwriteConfing.databasesId,
            appwriteConfing.postCollectionId,
            postId
        )

        if (!post) throw Error;

        return post
    } catch (error) {
        console.log(error)
    }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId: string) {
    if (!userId) return

    try {
        const posts = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.postCollectionId,
            [
                Query.equal('creator', userId),
                Query.orderDesc('$createdAt')
            ]
        )

        if (!posts) throw Error;

        return posts
    } catch (error) {
        console.log(error);
    }
}




export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(3)]
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.postCollectionId,
            queries
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function searchPost(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.postCollectionId,
            [Query.search('Caption', searchTerm),]
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

// get all users

export async function getAllUsers() {
    try {
        const allUsers = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.userCollecttionId
        )

        if (!allUsers) throw Error;

        return allUsers
    } catch (error) {
        console.log(error)
    }
}

//get saved posts

export async function getSavedPosts(userId: string) {
    try {
        const savedPosts = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.savesCollectionId,
            [Query.equal('users', userId)]
        )

        if (!savedPosts) throw Error;

        return savedPosts
    } catch (error) {
        console.log(error)
    }
}

//get userInfo by id

export async function getUserById(userId: string) {
    try {
        const userInfo = await databases.getDocument(
            appwriteConfing.databasesId,
            appwriteConfing.userCollecttionId,
            userId
        )

        if (!userInfo) throw Error;

        return userInfo
    } catch (error) {
        console.log(error)
    }
}

export const isAlreadyFollowing = async (followerID: string, followingId: string) => {
    try {

        const existingFollow = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.followersFollowingId,
            [
                Query.equal('followers', followerID),
                Query.equal('Followings', followingId)
            ]
        );

        if (!existingFollow) throw Error

        return existingFollow

    } catch (error) {
        console.log(error)
    }
}


export async function givingFollow(userId: string, followingId: string) {
    const alreadyFollowing = await isAlreadyFollowing(userId, followingId)

    if (alreadyFollowing && alreadyFollowing.documents.length > 0) {
        return null
    }

    try {
        const following = await databases.createDocument(
            appwriteConfing.databasesId,
            appwriteConfing.followersFollowingId,
            ID.unique(),
            {
                followers: userId,
                Followings: followingId
            }

        )

        if (!following) throw Error;

        return following
    }
    catch (error) {
        console.log(error)
    }
}

//giving unfollow

export async function givingUnfollow(userId: string, followingId: string) {
    try {
        const res = await isAlreadyFollowing(userId, followingId)

        if (!res || res.documents.length === 0) {
            return null
        }

        const following = await databases.deleteDocument(
            appwriteConfing.databasesId,
            appwriteConfing.followersFollowingId,
            res.documents[0].$id
        )

        if (!following) throw Error;

        return following
    }
    catch (error) {
        console.log(error)
    }
}

export async function getFollowerInfo(followerIDs: string[], followingIDs: string[]) {
    try {
        const queries: any = [];

        if (followerIDs && followerIDs.length > 0) {
            queries.push({
                key: 'followersInfo',
                promise: databases.listDocuments(
                    appwriteConfing.databasesId,
                    appwriteConfing.userCollecttionId,
                    [Query.equal('$id', followerIDs)]
                )
            });
        }

        if (followingIDs && followingIDs.length > 0) {
            queries.push({
                key: 'followingInfo',
                promise: databases.listDocuments(
                    appwriteConfing.databasesId,
                    appwriteConfing.userCollecttionId,
                    [Query.equal('$id', followingIDs)]
                )
            });
        }

        const results = await Promise.all(queries.map((q: { key: string, promise: Promise<any> }) => q.promise));
        const resultMap = Object.fromEntries(results.map((res, i) => [queries[i].key, res]));

        return {
            followerInfo: resultMap.followersInfo || null,
            followingInfo: resultMap.followingInfo || null
        };

    } catch (error) {
        console.error("Error in getFollowerInfo:", error);
        throw error;
    }
}

export async function getFollowInfo(userId: string) {


    try {

        const followers = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.followersFollowingId,
            [Query.equal('Followings', userId)]
        );

        const following = await databases.listDocuments(
            appwriteConfing.databasesId,
            appwriteConfing.followersFollowingId,
            [Query.equal('followers', userId)]
        );

        if (!followers || !following) throw Error;

        const followerIDs = followers?.documents.map(doc => doc.followers);
        const followingIDs = following?.documents.map(doc => doc.Followings);

        if (!followerIDs || !followingIDs) throw Error;

        const res = await getFollowerInfo(followerIDs, followingIDs)


        return {
            followerList: followers,
            followingList: following,
            followerInfo: res?.followerInfo,
            followingInfo: res?.followingInfo
        }

    } catch (error) {
        console.log(error);

    }

}

