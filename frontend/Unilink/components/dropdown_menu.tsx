import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';


type DropdownProps = {
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
  };

export default function Dropdown({ options, selectedValue, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(!open)} style={styles.selector}>
        <Text>{selectedValue || 'Select option'}</Text>
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
              style={styles.option}
            >
              <Text>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  option: {
    padding: 12,
  },
});