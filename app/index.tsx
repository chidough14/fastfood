import { Redirect } from "expo-router";

export default function Index() {
  // You can add auth logic here later
  return <Redirect href="/(tabs)" />;
}