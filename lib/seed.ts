import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";
import * as FileSystem from 'expo-file-system';

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appwriteConfig.databaseId,
    collectionId
  );

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
    )
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId);

  await Promise.all(
    list.files.map((file) =>
      storage.deleteFile(appwriteConfig.bucketId, file.$id)
    )
  );
}

// async function uploadImageToStorage(imageUrl: string) {
//   const response = await fetch(imageUrl);
//   const blob = await response.blob();

//   const fileObj = {
//     name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
//     type: blob.type,
//     size: blob.size,
//     uri: imageUrl,
//   };

//   const file = await storage.createFile(
//     appwriteConfig.bucketId,
//     ID.unique(),
//     fileObj
//   );

//   return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
// }

async function uploadImageToStorage(imageUrl: string) {
  try {
    // 1. Download the image to a local file
    const filename = imageUrl.split('/').pop() || `image-${Date.now()}.jpg`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

    const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);

    
    if (!fileInfo.exists || fileInfo.size == null) {
      throw new Error('Downloaded file not found or size unknown');
    }

    // 2. Prepare the file object for Appwrite
    const fileObj = {
      uri: downloadResult.uri,
      type: 'image/jpeg', // You can improve this by detecting actual MIME type
      name: filename,
      size: fileInfo.size,
    };


    // 3. Upload to Appwrite
    const uploadedFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      fileObj
    );

    // 4. Return file preview URL
    return storage.getFileViewURL(appwriteConfig.bucketId, uploadedFile.$id);
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw error;
  }
}

async function seed(): Promise<void> {
  try {
    // 1. Clear existing data
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();
  } catch (err) {
    console.error("❌ Error while clearing data:", err);
  }

  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    try {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        ID.unique(),
        cat
      );
      categoryMap[cat.name] = doc.$id;
    } catch (err) {
      console.error(`❌ Failed to create category '${cat.name}':`, err);
    }
  }

  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    try {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.customizationsCollectionId,
        ID.unique(),
        cus
      );
      customizationMap[cus.name] = doc.$id;
    } catch (err) {
      console.error(`❌ Failed to create customization '${cus.name}':`, err);
    }
  }

  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    try {
       console.log('📤 Uploading image for:', item.name, item.image_url); 

      const uploadedImage = await uploadImageToStorage(item.image_url);
      console.log('🚧 Saving document with image URL:', uploadedImage);
console.log('✅ Type of image URL:', typeof uploadedImage);
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: uploadedImage,
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryMap[item.category_name],
        }
      );
      menuMap[item.name] = doc.$id;

      for (const cusName of item.customizations) {
        try {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCustomizationsCollectionId,
            ID.unique(),
            {
              menu: doc.$id,
              customizations: customizationMap[cusName],
            }
          );
        } catch (err) {
          console.error(
            `❌ Failed to link customization '${cusName}' to '${item.name}':`,
            err
          );
        }
      }
    } catch (err) {
      console.error(`❌ Failed to create menu item '${item.name}':`, err);
    }
  }

  console.log("✅ Seeding complete.");
}


// async function seed(): Promise<void> {
//   // 1. Clear all
//   await clearAll(appwriteConfig.categoriesCollectionId);
//   await clearAll(appwriteConfig.customizationsCollectionId);
//   await clearAll(appwriteConfig.menuCollectionId);
//   await clearAll(appwriteConfig.menuCustomizationsCollectionId);
//   await clearStorage();

//   // 2. Create Categories
//   const categoryMap: Record<string, string> = {};
//   for (const cat of data.categories) {
//     const doc = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.categoriesCollectionId,
//       ID.unique(),
//       cat
//     );
//     categoryMap[cat.name] = doc.$id;
//   }

//   // 3. Create Customizations
//   const customizationMap: Record<string, string> = {};
//   for (const cus of data.customizations) {
//     const doc = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.customizationsCollectionId,
//       ID.unique(),
//       {
//         name: cus.name,
//         price: cus.price,
//         type: cus.type,
//       }
//     );
//     customizationMap[cus.name] = doc.$id;
//   }

//   // 4. Create Menu Items
//   const menuMap: Record<string, string> = {};
//   for (const item of data.menu) {
//     const uploadedImage = await uploadImageToStorage(item.image_url);

//     const doc = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.menuCollectionId,
//       ID.unique(),
//       {
//         name: item.name,
//         description: item.description,
//         image_url: uploadedImage,
//         price: item.price,
//         rating: item.rating,
//         calories: item.calories,
//         protein: item.protein,
//         categories: categoryMap[item.category_name],
//       }
//     );

//     menuMap[item.name] = doc.$id;

//     // 5. Create menu_customizations
//     for (const cusName of item.customizations) {
//       await databases.createDocument(
//         appwriteConfig.databaseId,
//         appwriteConfig.menuCustomizationsCollectionId,
//         ID.unique(),
//         {
//           menu: doc.$id,
//           customizations: customizationMap[cusName],
//         }
//       );
//     }
//   }

//   console.log("✅ Seeding complete.");
// }

export default seed;