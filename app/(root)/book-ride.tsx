import { useUser } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Image, Text, View } from "react-native";

import Payment from "@/components/Payment";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";

//npm install stripe --save
//npm install @stripe/stripe-react-native

const BookRide = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.filter(
    (driver) => +driver.id === selectedDriver,
  )[0];

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.uber"
      urlScheme="ryde"
    >
      <RideLayout title="Book Ride">
        <>
          <Text className="mb-3 text-xl font-JakartaSemiBold">
            Ride Information
          </Text>

          <View className="flex flex-col items-center justify-center w-full mt-10">
            <Image
              source={{ uri: driverDetails?.profile_image_url }}
              className="rounded-full w-28 h-28"
            />

            <View className="flex flex-row items-center justify-center mt-5 space-x-2">
              <Text className="text-lg font-JakartaSemiBold">
                {driverDetails?.title}
              </Text>

              <View className="flex flex-row items-center space-x-0.5">
                <Image
                  source={icons.star}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-JakartaRegular">
                  {driverDetails?.rating}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-col items-start justify-center w-full px-5 py-3 mt-5 rounded-3xl bg-general-600">
            <View className="flex flex-row items-center justify-between w-full py-3 border-b border-white">
              <Text className="text-lg font-JakartaRegular">Ride Price</Text>
              <Text className="text-lg font-JakartaRegular text-[#0CC25F]">
                ${driverDetails?.price}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full py-3 border-b border-white">
              <Text className="text-lg font-JakartaRegular">Pickup Time</Text>
              <Text className="text-lg font-JakartaRegular">
                {formatTime(driverDetails?.time!)}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full py-3">
              <Text className="text-lg font-JakartaRegular">Car Seats</Text>
              <Text className="text-lg font-JakartaRegular">
                {driverDetails?.car_seats}
              </Text>
            </View>
          </View>

          <View className="flex flex-col items-start justify-center w-full mt-5">
            <View className="flex flex-row items-center justify-start w-full py-3 mt-3 border-t border-b border-general-700">
              <Image source={icons.to} className="w-6 h-6" />
              <Text className="ml-2 text-lg font-JakartaRegular">
                {userAddress}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-start w-full py-3 border-b border-general-700">
              <Image source={icons.point} className="w-6 h-6" />
              <Text className="ml-2 text-lg font-JakartaRegular">
                {destinationAddress}
              </Text>
            </View>
          </View>

          <Payment
            fullName={user?.fullName!}
            email={user?.emailAddresses[0].emailAddress!}
            amount={driverDetails?.price!}
            driverId={driverDetails?.id}
            rideTime={driverDetails?.time!}
          />
        </>
      </RideLayout>
    </StripeProvider>
  );
};

export default BookRide;