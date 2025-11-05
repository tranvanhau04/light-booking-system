import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';


type Props = { title: string; onPress?: () => void; style?: any };


export default function ButtonPrimary({ title, onPress, style }: Props) {
return (
<TouchableOpacity style={[styles.btn, style]} onPress={onPress} activeOpacity={0.8}>
<Text style={styles.text}>{title}</Text>
</TouchableOpacity>
);
}


const styles = StyleSheet.create({
btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
text: { color: '#fff', fontWeight: '600' },
});