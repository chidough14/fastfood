import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { CustomInputProps } from '@/type'
import cn from 'clsx'

export default function CustomInput({
  placeholder = "Enter Text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View className='w-full'>
      <Text className='label'>{label}</Text>

      <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={isFocused ? '#000' : '#888'}
        className={cn('input', isFocused ? 'border-primary' : 'border-gray-300')}
      />
    </View>
  )
}