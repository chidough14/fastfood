import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'

export default function _Layout() {
  const isAuth = false; // Replace with actual auth logic
  if (!isAuth) {
    return (
      <Redirect href="/sign-in" />
    )
  }

  return (
    <Slot />
  )
}