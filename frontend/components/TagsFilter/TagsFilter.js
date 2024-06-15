// TagsFilter.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TagsFilter = ({ availableTags, selectedTags, onTagToggle }) => {
  return (
    <View style={styles.container}>
      {availableTags.map(tag => (
        <TouchableOpacity
          key={tag}
          style={selectedTags.includes(tag) ? styles.tagSelected : styles.tag}
          onPress={() => onTagToggle(tag)}
        >
          <Text style={styles.tagText}>{tag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  tag: {
    padding: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    margin: 5,
  },
  tagSelected: {
    padding: 8,
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
    borderRadius: 20,
    margin: 5,
  },
  tagText: {
    color: '#000',
    textAlign: 'center',
  }
});

export default TagsFilter;
