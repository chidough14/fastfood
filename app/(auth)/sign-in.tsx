import { View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomInput from '@/components/CustomInput'
import CustomButton from '@/components/CustomButton'
import { signIn } from '@/lib/appwrite'
import  * as Sentry from '@sentry/react-native'

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const submit = async () => {
     const {email, password} = form

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Call appwrite Sign in function here
      await signIn({email, password})

      Alert.alert('Success', 'User signed in successfully')
      router.replace('/')

    } catch (error: any) {
      console.error(error)
      Alert.alert('Error', error.message || 'An error occurred while signing in')
      Sentry.captureEvent(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
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
        title='Sign In'
        onPress={submit}
        isLoading={isSubmitting}
      />

      <View className='flex-row flex items-center justify-center mt-5 gap-2'>
        <Text className='base-regular text-gray-100'>
          Don't have an account?
        </Text>

        <Link href={"/sign-up"} className='text-primary base-bold'>
          Sign Up
        </Link>
      </View>
    </View>
  )
}