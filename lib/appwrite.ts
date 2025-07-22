import { CreateUserParams, SignInParams } from "@/type"
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite"

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.chidough.fastfood",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "687eb0eb00197b2db3e2",
  userCollectionId: "687eb145001d0ed015b6"
}

export const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform)


export const account = new Account(client)
export const databases = new Databases(client)
export const avatars = new Avatars(client)

export const createUser = async ({ email, password, name }: CreateUserParams) => {

  try {
    const newAccount = await account.create(ID.unique(), email, password, name)

    if (!newAccount) throw Error

    await signIn({ email, password })

    const avatarUrl = avatars.getInitialsURL(name)

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        email, name, accountId: newAccount.$id, avatar: avatarUrl
      }
    )

    return newUser
  } catch (error) {
    throw new Error(error as string)
  }

}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getCurrentUser = async () => {
  try {
     const currentAccount = await account.get()
     if (!currentAccount) throw Error

     const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
     )

      if (!currentUser) throw Error

      return currentUser.documents[0]
  } catch (error) {
    console.log("Error", error)
    throw new Error(error as string)
  }
}
