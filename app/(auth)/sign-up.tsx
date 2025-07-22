import { View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomInput from '@/components/CustomInput'
import CustomButton from '@/components/CustomButton'
import { createUser } from '@/lib/appwrite'

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const submit = async () => {
    const {name, email, password} = form

    if (name || email || password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Call appwrite Sign up function here
      await createUser({
        email,
        password,
        name
      })

      router.replace('/')

    } catch (error: any) {
      console.error(error)
      Alert.alert('Error', error.message || 'An error occurred while signing in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-2'>
      <CustomInput
        placeholder='Enter your full name'
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label='Name'
      />

       <CustomInput
        placeholder='Enter your email'
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label='Email'
        keyboardType='email-address'
      />

      <CustomInput
        placeholder='Enter your password'
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        label='Password'
        secureTextEntry={true}
      />

      <CustomButton
        title='Sign Up'
        onPress={submit}
        isLoading={isSubmitting}
      />

      <View className='flex-row flex items-center justify-center mt-3 gap-2'>
        <Text className='base-regular text-gray-100'>
         Already have an account?
        </Text>

        <Link href={"/sign-in"} className='text-primary base-bold'>
          Sign In
        </Link>
      </View>
    </View>
  )
}