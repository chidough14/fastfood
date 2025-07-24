import { View, Text, FlatList, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { Category } from '@/type'
import { router, useLocalSearchParams } from 'expo-router'
import cn from 'clsx'

export default function Filter({ categories }: { categories: any }) {
  const searchParams = useLocalSearchParams()
  
  const [active, setActive] = useState(searchParams.category || '')

  const handlePress = (id: string) => {
    setActive(id)

    if (id === 'all') {
      console.log("Setting category to undefined")
      router.setParams({ category: undefined })
    }
    else {
       console.log("Setting category to id", id)
      router.setParams({ category: id })
    }
  }

  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: 'all', name: 'All' }, ...categories]
    : [{ $id: 'all', name: 'All' }]

  return (
    <FlatList
      data={filterData}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            key={item.$id}
            className={cn('filter', active === item.$id ? 'bg-amber-500' : 'bg-white')}
            style={Platform.OS === 'android' ? { elevation: 5, shadowColor: '#878787' } : {}}
            onPress={() => handlePress(item.$id)}
          >
            <Text className={cn('body-medium', active === item.$id ? 'text-white' : 'text-gray-200')}>{item.name}</Text>
          </TouchableOpacity>
        )
      }}
      keyExtractor={item => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName='pb-3 gap-x-2'
    />
  )
}