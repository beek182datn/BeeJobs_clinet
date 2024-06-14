import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { fetchJobs, findJobByTitle, findJobBySalary, findJobByLocation, findJobByWorkType } from '@/components/fetch_data/api';
import { Job } from '@/components/Model/Model';
import JobsList from '@/components/list_obj/JobsList';
import { Picker } from '@react-native-picker/picker';

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [filterText, setFilterText] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // const handleFilter = (text: string) => {
  //   setFilterText(text);
  //   const filtered = jobs.filter((job) =>
  //     job.title.toLowerCase().includes(text.toLowerCase())
  //   );
  //   setFilteredJobs(filtered);
  //   setJobs(filtered);
  // };

  const handleFilterOption = (option: string) => {
    setSelectedFilterOption(option);
    setInputSearch(option)
    // Implement filtering logic based on the selected option
    if (option === 'title') {
      setInputSearch('Tiêu đề');
    } else if (option === 'salary') {
      setInputSearch('Mức lương');
    } else if (option === 'location') {
      setInputSearch('Địa điểm');
    } else if (option === 'type') {
      setInputSearch('Hình thức');
    } else {
      setFilteredJobs(jobs);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder={inputSearch}
          value={searchText}
          onChangeText={handleSearch}
          // inputMode={selectedFilterOption !== 'salary' ? 'text' : 'numeric'}
        />
        <Picker
          style={styles.filterInput}
          selectedValue={selectedFilterOption}
          onValueChange={handleFilterOption}
        >
          {filterOptions.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      {isLoading ? (
        <Text>Đang tải...</Text>
      ) : (
        <JobsList jobs={jobs} filtered={filteredJobs} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
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
  filterInput: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
});

export default Home;
