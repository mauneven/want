import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface SearchPostsProps {
  onSearch: (term: string) => void;
}

const SearchPosts: React.FC<SearchPostsProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { colors } = useTheme();

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{ ...styles.input, backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
        placeholderTextColor={colors.text}
        placeholder="Buscar posts..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Buscar" onPress={handleSearch} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default SearchPosts;