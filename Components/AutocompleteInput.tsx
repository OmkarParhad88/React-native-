import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AutocompleteInputProps {
  data: string[];
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  className?: string;
  style?: any;
  placeholderTextColor?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ data = [], value, onChangeText, placeholder, className, style, placeholderTextColor }) => {
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (text: string) => {
    onChangeText(text);
    if (text) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item: string) => {
    onChangeText(item);
    setShowSuggestions(false);
  };

  return (
    <View className="relative z-50">
      <TextInput
        value={value}
        onChangeText={handleInputChange}
        placeholder={placeholder}
        className={className}
        style={style}
        placeholderTextColor={placeholderTextColor}
        onFocus={() => {
          if (value) {
            const filtered = data.filter((item) =>
              item.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filtered);
            setShowSuggestions(true);
          }
        }}
      />
      {showSuggestions && filteredData.length > 0 && (
        <View className="relative right-0 bg-gray-50 border border-gray-200 rounded-xl shadow-lg max-h-40 z-50">
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectSuggestion(item)}
                className="p-4 p-3 border-b border-gray-100"
              >
                <Text className="text-gray-700">{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default AutocompleteInput;
