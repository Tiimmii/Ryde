import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useRef } from 'react'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from 'expo-router';
import { icons } from '@/constants';
import Map from './Map';
import { useDriverStore } from "@/store";

//npm i @gorhom/bottom-sheet

const RideLayout = ({ children, title, snapPoints }: { children: React.ReactNode, title: string, snapPoints?: string[]; }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { clearSelectedDriver } = useDriverStore();
    return (
        <GestureHandlerRootView>
            <View className='flex-1 bg-white'>
                <View className='flex flex-col h-screen bg-blue-500'>
                    <View className='absolute z-10 flex flex-row items-center justify-start px-5 top-16'>
                        <TouchableOpacity onPress={() => {
                            router.back()
                            clearSelectedDriver();
                            }}>
                            <View className='items-center justify-center w-8 h-8 p-5 bg-white rounded-full'>
                                <Image source={icons.backArrow} resizeMode='contain' />
                            </View>
                        </TouchableOpacity>
                        <Text className='ml-5 text-xl font-JakartaSemiBold'>
                            {
                                title || "Go Back"
                            }
                        </Text>
                    </View>
                    <Map />
                </View>
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints || ["45%", "85%"]}
                    index={0}
                >
                    {title !== "Choose a Rider" ? (
                        <BottomSheetView
                            style={{
                                flex: 1,
                                padding: 20,
                            }}
                        >
                            {children}
                        </BottomSheetView>
                    ) : (
                        <BottomSheetView
                            style={{
                                flex: 1,
                                padding: 20,
                            }}
                        >
                            {children}
                        </BottomSheetView>
                    )}
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}

export default RideLayout