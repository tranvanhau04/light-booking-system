import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';


type Props = { label?: string; value: string; onChangeText: (t: string) => void; placeholder?: string };


export default function InputField({ label, value, onChangeText, placeholder }: Props) {
return (
<View style={styles.wrap}>
{label ? <Text style={styles.label}>{label}</Text> : null}
<TextInput
value={value}
onChangeText={onChangeText}
placeholder={placeholder}
style={styles.input}
/>
</View>
);
}


const styles = StyleSheet.create({
wrap: { marginVertical: 8 },
label: { color: '#334155', marginBottom: 6 },
input: { borderWidth: 1, borderColor: '#e6e9ef', padding: 12, borderRadius: 10, backgroundColor: '#fff' },
});