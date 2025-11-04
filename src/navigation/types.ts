// Central location for all navigation types
// Import this file in your screens for type-safe navigation

export type RootTabParamList = {
  Home: undefined
  Search: undefined
  Profile: undefined
}

export type HomeStackParamList = {
  HomeMain: undefined
  FlightSearch: undefined
  FlightBookingSearchResults: {
    from: string
    to: string
    departDate: string
    returnDate?: string
    tripType: "round-trip" | "one-way" | "multi-city"
    passengers: {
      adults: number
      children: number
      infants: number
    }
    cabinClass: "Economy" | "Premium Economy" | "Business" | "First"
  }
  List: {
    from: string
    to: string
  }
  FlightBookingDetails: {
    flightId: string
  }
  CheckoutPassengerInformation: {
    flightId: string
    flightDetails: any
  }
  CheckoutBaggageInformation: undefined
  CheckoutSeatInformation: undefined
  CheckoutSelectSeats: {
    flightRoute: string
    flightType: string
  }
  CheckoutPayment: undefined
  CheckoutPaymentSuccess: {
    bookingId: string
    departure: string
    arrival: string
    departDate: string
    returnDate: string
    traveller: string
    flightClass: string
    tripType: string
    totalPrice: string
  }
}

export type SearchStackParamList = HomeStackParamList // Same structure

export type ProfileStackParamList = {
  ProfileMain: undefined
  EditProfile: undefined
  Security: undefined
  Notifications: undefined
  PaymentMethods: undefined
  Wallet: undefined
  Transactions: undefined
  HelpCenter: undefined
  AboutUs: undefined
  PrivacyPolicy: undefined
}

// Declare global types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}