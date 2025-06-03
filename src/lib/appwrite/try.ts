import { appwriteConfing, databases } from "./config.ts";

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

getAllUsers();