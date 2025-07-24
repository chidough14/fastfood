import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { images } from '@/constants'
// import { useDebouncedCallback } from 'use-debounce'

export default function SearchBar() {
  const params = useLocalSearchParams<{ query?: string }>()
  const [query, setQuery] = useState(params.query)

  // const debounceSearch = useDebouncedCallback(
  //   (text: string) => {
  //     router.push(`/search?query=${text}`)
  //   },
  //   600 // Adjust the debounce delay as needed
  // )

  const handleSearch = (text: string) => {
    setQuery(text)
    // debounceSearch(text)

    if (!text) router.setParams({ query: undefined })
  }


  const handleSubmit = () => {
    if (query?.trim()) router.setParams({ query })
  }       

  return (
    <View className='searchbar'>
      <TextInput
        className='flex-1 p-5'
        placeholder='Search for food, drinks, etc'
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        placeholderTextColor={'#a0a0a0'}
        returnKeyType='search'
      />

      <TouchableOpacity
        onPress={() => router.setParams({ query })}
        className=' pr-5'
      >
        <Image
          source={images.search}
          className='size-6'
          resizeMode='contain'
          tintColor={'#5d5f6d'}
        />
      </TouchableOpacity>
    </View>
  )
}