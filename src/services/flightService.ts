// Simple mock service - put under src/services if you extend later
export async function getFlights(_params?: any) {
await new Promise((r) => setTimeout(r, 300));
return [
{ id: 'f1', airline: 'Air Nova', origin: 'Hanoi', destination: 'Ho Chi Minh', depart: '07:30', arrive: '09:30', duration: '2h', price: 65 },
{ id: 'f2', airline: 'Skyways', origin: 'Hanoi', destination: 'Da Nang', depart: '08:45', arrive: '10:00', duration: '1h 15m', price: 42 },
{ id: 'f3', airline: 'VietFly', origin: 'Hanoi', destination: 'Ho Chi Minh', depart: '12:15', arrive: '14:20', duration: '2h 5m', price: 72 },
];
}