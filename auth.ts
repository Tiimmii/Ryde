import * as AuthSession from 'expo-auth-session';
import { fetchAPI } from './lib/fetch';


export const googleOAuth = async (startOAuthFlow: any) => {

    try {
        // Start the authentication process by calling `startSSOFlow()`
        const { createdSessionId, setActive, signUp } = await startOAuthFlow({
            strategy: 'oauth_google',
            // For web, defaults to current path
            // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
            // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
            redirectUrl: AuthSession.makeRedirectUri({ scheme: "ryde", path: "/(auth)/sign-in" }),
        })

        // If sign in was successful, set the active session
        if (createdSessionId) {
            if (setActive) {
                await setActive({ session: createdSessionId });
                if (signUp.createdUserId) {
                    await fetchAPI("/(api)/user", {
                        method: "POST",
                        body: JSON.stringify({
                            name: `${signUp.firstName} ${signUp.lastName}`,
                            email: signUp.email,
                            clerkId: signUp.createdUserId
                        })
                    })
                }
            }
            return {
                success: true,
                code: "success",
                message: "You have successfully authenticated"
            }
        }
        return {
            success: false,
            code: "session_exists",
            message: "An error occured",
        } 
    } catch (err: any) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
        return {
            success: false,
            code: err.errors[0].code,
            message: JSON.stringify(err.errors[0].code)
        }
    }
}