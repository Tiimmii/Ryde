import { View, Text, ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import OAuth from '@/components/OAuth'
import { useAuth, useSignIn } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'

const signIn = () => {

    const { signIn, setActive, isLoaded } = useSignIn()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const onSignInPress = async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/(root)/(tabs)/home')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert("Error", err.errors[0].longMessage)
        }
    }

    return (
        <ScrollView className='flex-1 bg-white'>
            <View className='flex-1 bg-white'>
                <View className='rekative w-full h-[250px]'>
                    <Image
                        source={images.signUpCar}
                        className='z-0 w-full h-[250px]'
                    />
                    <Text className='absolute text-2xl text-black font-JakartaSemiBold bottom-5 left-5'>
                        Welcome 👋
                    </Text>
                </View>
                <View className='p-5'>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                    >
                        <InputField
                            label='Email'
                            placeholder='Enter your email'
                            icon={icons.email}
                            value={form.email}
                            onChangeText={(value) => setForm({ ...form, email: value })}
                        />
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                    >
                        <InputField
                            label='Password'
                            placeholder='Enter your password'
                            icon={icons.lock}
                            value={form.password}
                            secureTextEntry={true}
                            onChangeText={(value) => setForm({ ...form, password: value })}
                        />
                    </KeyboardAvoidingView>


                    <CustomButton title='Sign in' onPress={onSignInPress} className='mt-6' />

                    <OAuth />

                    <Link href={"/sign-up"} className='mt-10 text-lg text-center text-general-200'>
                        <Text>Don't have an account?</Text>
                        <Text className='text-primary-500'>Sign up</Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    )
}

export default signIn;