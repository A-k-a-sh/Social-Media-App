import { Client, Account , Databases, Storage , Avatars} from 'appwrite';

export const appwriteConfing = {
    projectId : import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url : import.meta.env.VITE_APPWRITE_URL,
    storageId : import.meta.env.VITE_APPWRITE_STORAGE_ID,
    databasesId : import.meta.env.VITE_APPWRIRE_DATABASE_ID,
    userCollecttionId : import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postCollectionId : import.meta.env.VITE_APPWRIRE_POSTS_COLLECTION_ID,
    savesCollectionId : import.meta.env.VITE_APPWRIRE_SAVES_COLLECTION_ID,
    followersFollowingId : import.meta.env.VITE_APPWRIRE_FOLLOWERS_FOLLOWING_ID,
}

// console.log(import.meta.env.VITE_APPWRITE_PROJECT_ID);




export const client = new Client();

client.setProject(appwriteConfing.projectId)
client.setEndpoint(appwriteConfing.url)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);