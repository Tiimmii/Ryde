import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";

const Chat = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text className="text-2xl font-JakartaBold">Chat</Text>
        <View className="flex items-center justify-center flex-1 h-fit">
          <Image
            source={images.message}
            alt="message"
            className="w-full h-40"
            resizeMode="contain"
          />
          <Text className="mt-3 text-3xl font-JakartaBold">
            No Messages Yet
          </Text>
          <Text className="mt-2 text-base text-center px-7">
            Start a conversation with your friends and family
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;