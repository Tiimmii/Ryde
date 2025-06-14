import { View, Text, ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import OAuth from '@/components/OAuth'
import { useSignUp } from '@clerk/clerk-expo'
import ReactNativeModal from "react-native-modal";
import { fetchAPI } from '@/lib/fetch'

const signUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
    })

    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress: form.email,
                password: form.password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setVerification({
                ...verification, state: "pending"
            })
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert("Error", err.errors[0].longMessage)
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await fetchAPI("/(api)/user", {
                    method: "POST",
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        clerkId: signUpAttempt.createdUserId
                    })
                })
                await setActive({ session: signUpAttempt.createdSessionId })
                setVerification({
                    ...verification, state: "success"
                })
                setShowSuccessModal(true)
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                setVerification({
                    ...verification, state: "failed", error: "Verification failed."
                })
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            setVerification({
                ...verification,
                error: err.errors[0].longMessage,
                state: "failed"
            })
            console.error(JSON.stringify(err, null, 2))
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
                        Create Your Account
                    </Text>
                </View>
                <View className='p-5'>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                    >
                        <InputField
                            label='Name'
                            placeholder='Enter your name'
                            icon={icons.person}
                            value={form.name}
                            onChangeText={(value) => setForm({ ...form, name: value })}
                        />
                    </KeyboardAvoidingView>
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

                    <CustomButton title='Sign up' onPress={onSignUpPress} className='mt-6' />

                    <OAuth />

                    <Link href={"/sign-in"} className='mt-10 text-lg text-center text-general-200'>
                        <Text>Already have an account?</Text>
                        <Text className='text-primary-500'>Log in</Text>
                    </Link>
                </View>
                <ReactNativeModal
                    isVisible={verification.state === "pending"}
                    onModalHide={() => {
                        if (verification.state === "success") { setShowSuccessModal(true) }
                    }
                    }
                    coverScreen={true}
                    hasBackdrop={true}       // Shows a dark background
                    backdropColor="black"    // Customize dark overlay color
                    backdropOpacity={0.7}
                >
                    <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
                        <Text className='mb-2 text-2xl font-JakartaExtraBold'>
                            Verification
                        </Text>
                        <Text className='mb-5 font-Jakarta'>
                            We've sent a verification code to {form.email}
                        </Text>
                        <InputField
                            label='Code'
                            icon={icons.lock}
                            placeholder='12345'
                            keyboardType='numeric'
                            onChangeText={(code) =>
                                setVerification({
                                    ...verification,
                                    code: code
                                })
                            }
                        />
                        {
                            verification.error && (
                                <Text className='mt-1 text-sm text-red-500'>
                                    {verification.error}
                                </Text>
                            )
                        }

                        <CustomButton
                            title='Verify Email'
                            onPress={onVerifyPress}
                            className='mt-5 bg-success-500'
                        />
                    </View>
                </ReactNativeModal>
                <ReactNativeModal isVisible={
                    showSuccessModal
                } coverScreen={true}>
                    <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
                        <Image
                            source={images.check}
                            className='w-[110px] h-[110px] mx-auto my-5'
                        />
                        <Text className='text-3xl text-center font-JakartaBold'>
                            Verified
                        </Text>
                        <Text className='mt-2 text-base text-center text-gray-400 font-Jakarta'>
                            You have successfully verified your account.
                        </Text>

                        <CustomButton
                            title='Browse Home'
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.push("/(root)/(tabs)/home")
                            }
                            }
                            className='mt-5'
                        />
                    </View>
                </ReactNativeModal>
            </View>
        </ScrollView>
    )
}

export default signUp