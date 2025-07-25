import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import useAppwrite from '@/lib/useAppwrite'
import { getCurrentUser } from '@/lib/appwrite'
import { router } from 'expo-router'
import useAuthStore from '@/store/auth.store'

export default function ProfileScreen() {
  const user = {
    name: 'Adrian Hajdin',
    email: 'adrian@jsmastery.com',
    phone: '+1 555 123 4567',
    address1: '123 Main Street, Springfield, IL 62704',
    address2: '221B Rose Street, Foodville, FL 12345',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  }

     const { logoutUser} = useAuthStore()

  const { data } = useAppwrite({
    fn: getCurrentUser
  })

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.replace('/sign-in') // Redirect to login page
    } catch (err) {
      Alert.alert('Error', 'Failed to log out')
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white px-5 pb-10 pt-10">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Profile</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View className="items-center mt-4 mb-6">
        <View className="relative">
          <Image
            source={{ uri: data?.avatar ?? "User" }}
            className="w-[90px] h-[90px] rounded-full"
          />
          <TouchableOpacity className="absolute -bottom-1 -right-2 bg-orange-400 p-1.5 rounded-full">
            <Ionicons name="create" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info */}
      <View className="space-y-5 mb-6">
        <ProfileItem icon="person" label="Full Name" value={data?.name!} />
        <ProfileItem icon="mail" label="Email" value={data?.email!} />
        <ProfileItem icon="call" label="Phone number" value={data?.phone!} />
        <ProfileItem icon="location" label="Address 1 - (Home)" value={user.address1} />
        <ProfileItem icon="location" label="Address 2 - (Work)" value={user.address2} />
      </View>

      {/* Buttons */}
      <TouchableOpacity className="bg-orange-100 py-3 rounded-full mb-4 items-center">
        <Text className="text-orange-500 font-semibold">Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center justify-center border border-red-500 py-3 rounded-full"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#e53935" />
        <Text className="text-red-500 ml-2 font-semibold">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

type ProfileItemProps = {
  icon: any
  label: string
  value: string
}

function ProfileItem({ icon, label, value }: ProfileItemProps) {
  return (
    <View className="flex-row items-start space-x-3">
      <Ionicons name={icon} size={20} color="#f5a623" className="mt-1" />
      <View>
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-base text-gray-800 font-medium">{value}</Text>
      </View>
    </View>
  )
}
