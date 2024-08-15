import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
                        marginLeft: 10,
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
        backgroundColor: "#2196F3",
        position: 'relative'
    },
    searchBar: {
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
        zIndex: 1000,
    },
    searchInput: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        // paddingHorizontal: 12,
        // paddingVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "white",
        borderRadius: 8,
    },
    filterIcon: {
        fontSize: 24,
    },
    optionsContainer: {
        position: "absolute",
        top: 50,
        right: 10,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 8,
        zIndex: 1000,
    },
    filterOption: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        // zIndex: 1000
    },
    filterOptionText: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        borderBlockStartColor: 'yellow'
    },
    loadingText: {
        fontSize: 18,
        color: "#666",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
    }
})