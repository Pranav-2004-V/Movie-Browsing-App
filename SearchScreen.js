import { View, Text, Dimensions, SafeAreaView, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image } from "react-native";
import React, { useState, useCallback } from "react";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import Loading from "../components/loading";
import { fallbackMoviePoster, fetchSearchMovies, image185 } from "../api/moviedb";

var {width, height} = Dimensions.get("window");

export default function SearchScreen() {
    const navigation = useNavigation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    let movieName = 'Ant-Ma and the Wasp: Quantumania';

    const handleSearch = value => {
        if(value && value.length > 2) {
            setLoading(true);
            fetchSearchMovies({
                query: value,
                include_adult: 'false',
                language: 'en-US',
                page: '1'
            }).then(data=>{
                setLoading(false);
                // console.log("Search results: " + JSON.stringify(data));
                if(data && data.results) setResults(data.results);
            })
        } else {
            setLoading(false);
            setResults([]);
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    return (
        <SafeAreaView className="bg-neutral-800 flex-1">
            <View
                className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full"
            >
                <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="Search Movie"
                    placeholderTextColor={'lightgray'}
                    className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    className="rounded-full p-3 m-1 bg-neutral-500"
                >
                    <XMarkIcon size="20" color="white" />
                </TouchableOpacity>
            </View>

            {
                loading? (
                    <Loading />
                ) : 
                
                results.length > 0 ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingHorizontal: 15}}
                        className="space-y-3">
                            <Text className="text-white font-semibold ml-1">Results ({results.length})</Text>
                            <View className="flex-row justify-between flex-wrap">
                                {
                                    results.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback
                                                key={index}
                                                onPress={() => navigation.push("Movie", item)}
                                            >
                                                <View className="space-y-2 mb-4">
                                                    <Image className="rounded-3xl"
                                                        source={{uri: image185(item?.poster_path) || fallbackMoviePoster }}
                                                        // source={require("../assets/images/moviePoster1.png")}
                                                        style={{width: width * 0.44, height: height * 0.3 }}
                                                    />
                                                    <Text className="text-neutral-400 ml-1">
                                                        {
                                                            item?.title.length > 22 ? item?.title.slice(0, 22) + "..." : item?.title
                                                        }
                                                    </Text> 
                                                </View>
                                                
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                    </ScrollView>
                
                ) : (
                    <View className="flex-col justify-center items-center">
                        <Image source={require("../assets/images/movieTime.png")}
                            className="h-96 w-96" />
                        <Text className="text-xl text-neutral-400">Start searching...</Text>
                    </View>
                )
                    
                
            }

            
            {
                
            }
            

        </SafeAreaView>
    )
}