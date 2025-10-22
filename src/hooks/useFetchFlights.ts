import { useEffect, useState } from 'react';
import { getFlights } from '../services/flightService';


export function useFetchFlights(params?: any) {
const [flights, setFlights] = useState<any[]>([]);
const [loading, setLoading] = useState(false);


useEffect(() => {
let mounted = true;
setLoading(true);
getFlights(params)
.then((res) => {
if (!mounted) return;
setFlights(res);
})
.finally(() => mounted && setLoading(false));


return () => {
mounted = false;
};
}, [JSON.stringify(params)]);


return { flights, loading };
}