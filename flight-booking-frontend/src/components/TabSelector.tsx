import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { spacing } from '../styles/spacing';


export default function TabSelector({ tabs, activeIndex = 0, onChange }: any) {
return (
<View style={styles.row}>
{tabs.map((t: string, i: number) => (
<TouchableOpacity key={t} style={[styles.tab, activeIndex === i && styles.active]} onPress={() => onChange?.(i)}>
<Text style={[styles.label, activeIndex === i && styles.labelActive]}>{t}</Text>
</TouchableOpacity>
))}
</View>
);
}


const styles = StyleSheet.create({
row: { flexDirection: 'row', marginVertical: spacing.sm },
tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginRight: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eef2f6' },
active: { backgroundColor: '#f0fdfa', borderColor: '#bbf7d0' },
label: { color: '#475569' },
labelActive: { color: '#065f46', fontWeight: '700' },
});