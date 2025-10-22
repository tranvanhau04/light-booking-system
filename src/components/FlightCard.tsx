import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';


export default function FlightCard({ flight, onPress }: any) {
return (
<TouchableOpacity style={styles.card} onPress={() => onPress?.(flight)} activeOpacity={0.8}>
<View style={{ flex: 1 }}>
<Text style={styles.route}>{flight.origin} → {flight.destination}</Text>
<Text style={styles.airline}>{flight.airline} · {flight.duration}</Text>
<Text style={styles.time}>{flight.depart} - {flight.arrive}</Text>
</View>
<Text style={styles.price}>${flight.price}</Text>
</TouchableOpacity>
);
}


const styles = StyleSheet.create({
card: { flexDirection: 'row', padding: 14, borderRadius: 12, backgroundColor: colors.card, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#eef2f6' },
route: { fontSize: 16, fontWeight: '700', color: colors.text },
airline: { color: '#475569', marginTop: 4 },
time: { color: '#64748b', marginTop: 2 },
price: { fontWeight: '800', fontSize: 16, color: colors.primary },
});