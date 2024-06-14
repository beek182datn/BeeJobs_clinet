import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  onSearch: (text: string) => void;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm..."
        value={searchText}
        onChangeText={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});

export default SearchBarComponent;
