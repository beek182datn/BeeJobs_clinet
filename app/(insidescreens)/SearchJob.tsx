import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import JobsList from '@/components/comps/JobsList';
import { Job } from '@/components/Model/Model';
import { findJobByLocation, findJobBySalary, findJobByTitle, findJobByWorkType } from '@/components/fetch_data/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
        setSelectedFilterOption(value);
        setInputSearch(value === "title" ? "Tiêu đề" : value === "salary" ? "Mức lương" : value === "location" ? "Địa điểm" : "Hình thức");
        setShowOptions(false);
    };

    const FilterOption: React.FC<FilterOptionProps> = ({ label, value, onPress }) => (
        <TouchableOpacity style={styles.filterOption} onPress={() => onPress(value)}>
            <Text style={styles.filterOptionText}>{label}</Text>
        </TouchableOpacity>
    );

    const search = async (text: string) => {
        setIsLoading(true);
        let results;
        if (selectedFilterOption === "title") {
        console.log(text);

            results = await findJobByTitle(text);
        } else if (selectedFilterOption === "salary") {
            results = await findJobBySalary(text);
        } else if (selectedFilterOption === "location") {
            results = await findJobByLocation(text);
        } else if (selectedFilterOption === "type") {
            results = await findJobByWorkType(text);
        }
        setIsLoading(false);
        if (results) setJobs(results);
    };

    // Hàm debounce cho tìm kiếm
    const debounce = (func: Function, delay: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debouncedSearch = debounce(search, 1000);

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (text.length === 0) {
            setJobs([]); 
        } else {
            debouncedSearch(text);
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
                <Icon name="tune" size={30} color="black" />
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
                        renderItem={({ item }) => <JobsList job={item} callback={() => { setJobs([]) }} />}
                        keyExtractor={(item) => item._id.toString()}
                        contentContainerStyle={{ paddingBottom: 90 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

export default SearchJob;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 10,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 15,
        backgroundColor: "#FFFFFF",
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
        backgroundColor: "#EFEFEF",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginRight: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 3,
    },
    filterButton: {
        backgroundColor: "#2196F3",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 101, // Đảm bảo nút có zIndex cao hơn các thành phần khác
    },
    filterIcon: {
        fontSize: 20,
        color: "#FFFFFF",
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
        zIndex: 1000, // Đảm bảo zIndex cao để không bị che khuất
        height: 'auto', // Điều chỉnh chiều cao tự động
    },
    
    filterOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    filterOptionText: {
        fontSize: 16,
        color: "#333",
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
