import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import { MenuItem } from '@/type'
import { appwriteConfig } from '@/lib/appwrite'
import { useCartStore } from '@/store/cart.store'

export default function MenuCard({ item: { $id, image_url, name, price } }: { item: MenuItem }) {

  const imageUrl = `${image_url}`
  const { addItem } = useCartStore()

  // console.log(imageUrl)

  return (
    <TouchableOpacity className='menu-card' style={Platform.OS === 'android' ? { shadowColor: '#878787', elevation: 10 } : {}}>
      <Image
        source={{ uri: imageUrl }}
        className='size-32 absolute -top-10'
        resizeMode='contain'
      />
      <Text className='text-center base-bold text-dark-100 mb-2' numberOfLines={1}>{name}</Text>
      <Text className='body-regular text-gray-200 mb-4'>From {price}</Text>

      <TouchableOpacity 
        onPress={() => addItem({ id: $id, name, price, image_url: imageUrl, customizations: [] })} 
        className='bg-primary rounded-full p-3 flex-center'
      >
        <Text className='paragraph-bold text-white'>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}