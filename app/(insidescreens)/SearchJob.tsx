import { ActivityIndicator, FlatList, ScrollView, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import JobsList from '@/components/comps/JobsList';
import { Job } from '@/components/Model/Model';
import { findJobByLocation, findJobBySalary, findJobByTitle, findJobByWorkType } from '@/components/fetch_data/api';

interface FilterOptionProps {
    label: string;
    value: string;
    onPress: (value: string) => void;
}

const SearchJob = () => {
    const [inputSearch, setInputSearch] = useState("Tìm kiếm");
    const [searchText, setSearchText] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [selectedFilterOption, setSelectedFilterOption] = useState("title");
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);

    const [filterOptions, setFilterOptions] = useState([
        { label: "Tiêu đề", value: "title" },
        { label: "Mức lương", value: "salary" },
        { label: "Địa điểm", value: "location" },
        { label: "Hình thức", value: "type" },
    ]);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleOptionPress = (value: string) => {
        // Xử lý logic khi chọn một tùy chọn
        setSelectedFilterOption(value);
        setInputSearch(value);
        if (value === "title") {
            setInputSearch("Tiêu đề");
        } else if (value === "salary") {
            setInputSearch("Mức lương");
        } else if (value === "location") {
            setInputSearch("Địa điểm");
        } else if (value === "type") {
            setInputSearch("Hình thức");
        }
        // console.log(`Đã chọn tùy chọn: ${value}`);
        setShowOptions(false);
    };

    const FilterOption: React.FC<FilterOptionProps> = ({
        label,
        value,
        onPress,
    }) => (
        <TouchableOpacity
            style={styles.filterOption}
            onPress={() => onPress(value)}
        >
            <Text style={styles.filterOptionText}>{label}</Text>
        </TouchableOpacity>
    );


    const handleSearch = async (text: string) => {
        setSearchText(text);
        if (selectedFilterOption === "title") {
            setIsLoading(true)
            const results = await findJobByTitle(text);
            setIsLoading(false)
            setJobs(results);
        } else if (selectedFilterOption === "salary") {
            setIsLoading(true)
            const results = await findJobBySalary(text);
            setIsLoading(false)
            setJobs(results);
        } else if (selectedFilterOption === "location") {
            setIsLoading(true)
            const results = await findJobByLocation(text);
            setIsLoading(false)
            setJobs(results);
        } else if (selectedFilterOption === "type") {
            setIsLoading(true)
            const results = await findJobByWorkType(text);
            setIsLoading(false)
            setJobs(results);
        } else{
            console.log("long");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={router.back}
                    style={{
                        backgroundColor: "#2196F3",
                        borderRadius: 30,
                        padding: 5,
                        marginRight: 10,
                        zIndex: 100
                    }}
                >
                    <Ionicons name="arrow-back" size={22} color="black" />
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder={inputSearch}
                    value={searchText}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity onPress={toggleOptions} style={styles.filterButton}>
                    <Text style={styles.filterIcon}>🔍</Text>
                </TouchableOpacity>
                {showOptions && (
                    <View style={styles.optionsContainer}>
                        {filterOptions.map((option, index) => (
                            <FilterOption
                                key={index}
                                label={option.label}
                                value={option.value}
                                onPress={handleOptionPress}
                            />
                        ))}
                    </View>
                )}
            </View>

            <View>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0099FF" />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={searchText ? jobs : []}
                        renderItem={({ item }) => <JobsList job={item} callback={()=>{setJobs([])}}/>}
                        keyExtractor={(item) => item._id.toString()}
                        contentContainerStyle={{ paddingBottom: 90 }} 
                    />
                )}
            </View>

        </SafeAreaView>
    )
}

export default SearchJob

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5", // Light background for better readability
        padding: 10, // Padding around the edges
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 15,
        backgroundColor: "#FFFFFF", // White background for the header
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        backgroundColor: "#EFEFEF", // Softer gray for the search input
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginRight: 10, // Space between input and filter button
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 3,
    },
    filterButton: {
        backgroundColor: "#2196F3", // Blue color to match the theme
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    filterIcon: {
        fontSize: 20,
        color: "#FFFFFF", // White icon for contrast
    },
    optionsContainer: {
        position: "absolute",
        top: 60,
        right: 10,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1000,
    },
    filterOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    filterOptionText: {
        fontSize: 16,
        color: "#333", // Darker text for better readability
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#666",
        marginTop: 10,
    },
});
