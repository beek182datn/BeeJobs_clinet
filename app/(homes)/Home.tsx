import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { fetchJobs, findJobByTitle, findJobBySalary, findJobByLocation, findJobByWorkType } from '@/components/fetch_data/api';
import { Job } from '@/components/Model/Model';
import JobsList from '@/components/list_obj/JobsList';

interface FilterOptionProps {
  label: string;
  value: string;
  onPress: (value: string) => void;
}

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [filterText, setFilterText] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [filterOptions, setFilterOptions] = useState([
    { label: 'Tiêu đề', value: 'title' },
    { label: 'Mức lương', value: 'salary' },
    { label: 'Địa điểm', value: 'location' },
    { label: 'Hình thức', value: 'type' },
  ]);
  const [selectedFilterOption, setSelectedFilterOption] = useState('title');
  const [inputSearch, setInputSearch] = useState('Tiêu đề');

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      const fetchedJobs = await fetchJobs();
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
      setIsLoading(false);
    };
    loadJobs();
  }, []);

  const handleSearch = async (text: string) => {
      setSearchText(text);
      if (selectedFilterOption === 'title') {
        const results = await findJobByTitle(text);
        setFilteredJobs(results);
      } else if (selectedFilterOption === 'salary') {
        const results = await findJobBySalary(text);
        setFilteredJobs(results);
      } else if (selectedFilterOption === 'location') {
        const results = await findJobByLocation(text);
        setFilteredJobs(results);
      }  else if (selectedFilterOption === 'type') {
        const results = await findJobByWorkType(text);
        setFilteredJobs(results);
      }else {
        console.log('null')
      }
    };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionPress = (value: string) => {
    // Xử lý logic khi chọn một tùy chọn
    setSelectedFilterOption(value);
    setInputSearch(value)
    if (value === 'title') {
      setInputSearch('Tiêu đề');
    } else if (value === 'salary') {
      setInputSearch('Mức lương');
    } else if (value === 'location') {
      setInputSearch('Địa điểm');
    } else if (value === 'type') {
      setInputSearch('Hình thức');
    } else {
      setFilteredJobs(jobs);
    }
    console.log(`Đã chọn tùy chọn: ${value}`);
    setShowOptions(false);
  };

  const FilterOption: React.FC<FilterOptionProps> = ({ label, value, onPress }) => (
    <TouchableOpacity style={styles.filterOption} onPress={() => onPress(value)}>
      <Text style={styles.filterOptionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    
      <View style={styles.searchBar}>
      <Image source={require('../../assets/images/bee_jobs_light_blue.png')} style={styles.logo} />
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <JobsList job={item} />}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    zIndex:10,
    marginTop: 50,
    position:'relative'
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  filterIcon: {
    fontSize: 24,
  },
  optionsContainer: {
    position: 'absolute',
    top: 50,
    right:0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    zIndex: 10,
  },
  filterOption: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  filterOptionText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  logo:{
    width:50,
    height:50,
    zIndex:-1,
  }
});

export default Home;
