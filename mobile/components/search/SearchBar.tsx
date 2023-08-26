import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <View style={{ flexDirection: 'row', padding: 10 }}>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar..."
        style={{ flex: 1 }}
      />
      <Button title="Buscar" onPress={() => onSearch(searchTerm)} />
    </View>
  );
};

export default SearchBar;
