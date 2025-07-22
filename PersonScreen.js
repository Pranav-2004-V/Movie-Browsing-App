import { View, Text, Dimensions, Platform, ScrollView, SafeAreaView, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "../theme";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image500 } from "../api/moviedb";

var {width, height} = Dimensions.get("window");
const ios = Platform.OS == 'ios';
const verticalMargin = ios ? '' : 'my-3';

export default function PersonScreen() {
    const {params: item} = useRoute();
    const navigation = useNavigation();
    const [isFavourite, toggleFavourite] = useState(false);
    const [person, setPerson] = useState({});
    const [personMovies, setPersonMovies] = useState([1, 2, 3, 4, 5]);
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        setLoading(true);
        console.log('person: ', item);
        getPersonDetails(item.id);
        getPersonMovies(item.id);
    },[item]);

    const getPersonDetails = async id=> {
        const data = await fetchPersonDetails(id);
        console.log('Got Person Details: ', data);
        if(data) setPerson(data);
        setLoading(false);
    }

    const getPersonMovies = async id=> {
        const data = await fetchPersonMovies(id);
        // console.log('Got Person Movies: ', data);
        if(data && data.cast) {
            setPersonMovies(data.cast);
        } 
        // else if(data && data.crew){
        //     setPersonMovies(data.crew);
        // }
        // setLoading(false);
        console.log('Got Person Movies: ', personMovies);
    }

    return (
        <ScrollView 
            className="flex-1 bg-neutral-900"
            contentContainerStyle={{paddingBottom: 20}}
        >
            {/* Back button */}
            <SafeAreaView className={"z-20 w-full flex-row justify-between items-center px-4" + verticalMargin}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" /> 
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
                    <HeartIcon size="35" color={ isFavourite ? "red" : "white" } />
                </TouchableOpacity>
            </SafeAreaView>
            
            {/* Person Details */}
            {
                loading? (
                    <Loading />
                ) : (
                    <View>
                        <View className="flex-row justify-center"
                        style={{
                            shadowColor: "gray",
                            shadowRadius: 40,
                            shadowOffset: {width: 0, height: 5},
                            shadowOpacity: 1
                        }}
                        >
                            <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-500">
                                <Image
                                    // source={require("../assets/images/castImage2.png")}
                                    source={{uri: image500(person.profile_path) || fallbackPersonImage }}
                                    style={{height: height * 0.43, width: width * 0.74}}
                            />
                            </View>

                            
                            
                        </View>
                        <View className="mt-6">
                            <Text className="text-3xl text-white font-bold text-center">
                                {
                                    person?.name
                                }
                            </Text>
                            <Text className="text-base text-neutral-500 text-center">
                                {
                                    person?.place_of_birth
                                }
                            </Text>
                            
                        </View>
                        <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
                            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                                <Text className="text-white font-semibold">Gender</Text>
                                <Text className="text-neutral-300 text-sm">{person?.gender == 1 ? "Female" : "Male"}</Text>
                            </View>
                            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                                <Text className="text-white font-semibold">Birthday</Text>
                                <Text className="text-neutral-300 text-sm">{person?.birthday}</Text>
                            </View>
                            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                                <Text className="text-white font-semibold">Known for</Text>
                                <Text className="text-neutral-300 text-sm">{person?.known_for_department}</Text>
                            </View>
                            <View className="px-2 items-center">
                                <Text className="text-white font-semibold">Popularity</Text>
                                <Text className="text-neutral-300 text-sm">{person?.popularity?.toFixed(2)} </Text>
                            </View>
                        </View>

                        {/* Biography */}
                        <View className="my-6 mx-4 space-y-2">
                            <Text className="text-white text-lg">Biography</Text>
                            <Text className="text-neutral-400 tracking-wide">
                                {
                                    person?.biography || "N/A"
                                }
                            </Text>
                        </View>

                        {/* Movies */}
                        { console.log("Person movies length: " + personMovies.length) }
                        { personMovies.length > 0 ? <MovieList title="Movies" hideSeeAll={true} data={personMovies} /> : null }
                    </View>
                )
            }
            
        </ScrollView>
    )
}