CREATE DATABASE IF NOT EXISTS flight_booking;
USE flight_booking;
USE flight_booking;
-- Bảng tài khoản đăng nhập
CREATE TABLE Account (
    accountId VARCHAR(20) PRIMARY KEY,
    userName VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL
);

-- Bảng người dùng
CREATE TABLE User (
    userId VARCHAR(10) PRIMARY KEY,
    fullName VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    phone VARCHAR(15),
    dateOfBirth DATE,
    nationality VARCHAR(20),
    accountId VARCHAR(20),
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
);

-- Bảng chuyến bay
CREATE TABLE Flight (
    flightId VARCHAR(10) PRIMARY KEY,
    flightCode VARCHAR(10) NOT NULL,
    departureAirport VARCHAR(20) NOT NULL,
    arrivalAirport VARCHAR(20) NOT NULL,
    departureTime DATETIME NOT NULL,
    arrivalTime DATETIME NOT NULL,
    duration INT,
    tripType VARCHAR(20),
    airline VARCHAR(20),
    basePrice DOUBLE,
    stopCount INT
);

-- Bảng hạng ghế (cabin class)
CREATE TABLE CabinClass (
    classId VARCHAR(10) PRIMARY KEY,
    className VARCHAR(20),
    priceMultiplier DOUBLE,
    availableSeats INT
);

-- Liên kết hạng ghế và chuyến bay
CREATE TABLE FlightCabinClass (
    cabinId VARCHAR(10),
    flightId VARCHAR(10),
    PRIMARY KEY (cabinId, flightId),
    FOREIGN KEY (cabinId) REFERENCES CabinClass(classId),
    FOREIGN KEY (flightId) REFERENCES Flight(flightId)
);

-- Bảng đặt vé
CREATE TABLE Booking (
    bookingId VARCHAR(10) PRIMARY KEY,
    bookingDate DATE,
    totalPrice DOUBLE,
    status VARCHAR(10),
    userId VARCHAR(10),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- Liên kết chuyến bay và đặt vé
CREATE TABLE FlightBooking (
    flightId VARCHAR(10),
    bookingId VARCHAR(10),
    PRIMARY KEY (flightId, bookingId),
    FOREIGN KEY (flightId) REFERENCES Flight(flightId),
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId)
);

-- Bảng hành khách
CREATE TABLE Passenger (
    passengerId VARCHAR(10) PRIMARY KEY,
    fullName VARCHAR(50),
    gender VARCHAR(10),
    dateOfBirth DATE,
    nationality VARCHAR(20),
    idNumber VARCHAR(20)
);

-- Liên kết đặt vé và hành khách
CREATE TABLE BookingPassenger (
    bookingId VARCHAR(10),
    passengerId VARCHAR(10),
    PRIMARY KEY (bookingId, passengerId),
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId),
    FOREIGN KEY (passengerId) REFERENCES Passenger(passengerId)
);

-- Bảng ghế ngồi
CREATE TABLE SeatSelection (
    seatId VARCHAR(10) PRIMARY KEY,
    seatNumber VARCHAR(10),
    status VARCHAR(10),
    cabinId VARCHAR(10),
    bookingId VARCHAR(10),
    FOREIGN KEY (cabinId) REFERENCES CabinClass(classId),
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId)
);

-- Bảng hành lý
CREATE TABLE Baggage (
    baggageId VARCHAR(10) PRIMARY KEY,
    weight VARCHAR(10),
    price DOUBLE,
    type VARCHAR(10),
    bookingId VARCHAR(10),
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId)
);

-- Bảng thanh toán
CREATE TABLE Payment (
    paymentId VARCHAR(10) PRIMARY KEY,
    amount DOUBLE,
    status VARCHAR(10),
    transactionTime DATETIME,
    bankTransactionId VARCHAR(20),
    bookingId VARCHAR(10),
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId)
);


USE flight_booking;

-- ===============================
-- 1️⃣ Account
-- ===============================
INSERT INTO Account (accountId, userName, password)
VALUES
('ACC001', 'pedro_m', 'Pedro@123'),
('ACC002', 'anna_sky', 'Anna@456'),
('ACC003', 'john_travel', 'John@789'),
('ACC004', 'lucy_p', 'Lucy@111'),
('ACC005', 'michael_b', 'Mike@222'),
('ACC006', 'emily_j', 'Emi@333'),
('ACC007', 'thomas_r', 'Thom@444'),
('ACC008', 'sofia_k', 'Sofia@555');

-- ===============================
-- 2️⃣ User
-- ===============================
INSERT INTO User (userId, fullName, email, phone, dateOfBirth, nationality, accountId)
VALUES
('USR001', 'Pedro Moreno', 'pedro.moreno@gmail.com', '+120656789', '1992-03-10', 'USA', 'ACC001'),
('USR002', 'Anna Skylar', 'anna.skylar@mail.com', '+447700900', '1988-08-22', 'UK', 'ACC002'),
('USR003', 'John Carter', 'john.carter@mail.com', '+61345900', '1990-11-02', 'Australia', 'ACC003'),
('USR004', 'Lucy Park', 'lucy.park@mail.com', '+8210556677', '1995-06-20', 'Korea', 'ACC004'),
('USR005', 'Michael Brown', 'michael.brown@mail.com', '+331066778', '1985-01-15', 'France', 'ACC005'),
('USR006', 'Emily Johnson', 'emily.johnson@mail.com', '+120233445', '1993-12-02', 'Canada', 'ACC006'),
('USR007', 'Thomas Reed', 'thomas.reed@mail.com', '+498899772', '1991-07-08', 'Germany', 'ACC007'),
('USR008', 'Sofia Kim', 'sofia.kim@mail.com', '+659988776', '1994-05-11', 'Singapore', 'ACC008');

-- ===============================
-- 3️⃣ Flight
-- ===============================
INSERT INTO Flight (flightId, flightCode, departureAirport, arrivalAirport, departureTime, arrivalTime, duration, tripType, airline, basePrice, stopCount)
VALUES
('FL001', 'LCYJFK', 'London City', 'John F Kennedy', '2025-07-14 06:30:00', '2025-07-14 14:00:00', 450, 'Round-trip', 'SkyHaven', 806.00, 0),
('FL002', 'JFKLCY', 'John F Kennedy', 'London City', '2025-07-17 10:00:00', '2025-07-17 22:15:00', 435, 'Round-trip', 'EcoWings', 806.00, 0),
('FL003', 'HKGNYC', 'Hong Kong', 'New York', '2025-08-01 22:30:00', '2025-08-02 07:30:00', 540, 'One-way', 'AirAsia', 950.00, 1),
('FL004', 'NYCLAX', 'New York', 'Los Angeles', '2025-09-05 09:00:00', '2025-09-05 12:30:00', 210, 'One-way', 'DeltaAir', 320.00, 0),
('FL005', 'LAXSYD', 'Los Angeles', 'Sydney', '2025-10-10 20:30:00', '2025-10-11 06:15:00', 525, 'One-way', 'Qantas', 1050.00, 0),
('FL006', 'SYDLAX', 'Sydney', 'Los Angeles', '2025-10-17 08:00:00', '2025-10-17 21:15:00', 555, 'Round-trip', 'Qantas', 1050.00, 0),
('FL007', 'CDGHND', 'Paris CDG', 'Tokyo Haneda', '2025-11-01 09:30:00', '2025-11-01 23:00:00', 570, 'One-way', 'JapanAir', 890.00, 1),
('FL008', 'HNDCGD', 'Tokyo Haneda', 'Paris CDG', '2025-11-10 10:00:00', '2025-11-10 16:00:00', 600, 'Round-trip', 'JapanAir', 890.00, 1),
('FL009', 'SINBKK', 'Singapore', 'Bangkok', '2025-12-05 11:00:00', '2025-12-05 12:45:00', 105, 'One-way', 'Scoot', 150.00, 0),
('FL010', 'BKKSIN', 'Bangkok', 'Singapore', '2025-12-10 13:15:00', '2025-12-10 15:00:00', 105, 'Round-trip', 'Scoot', 150.00, 0);

-- ===============================
-- 4️⃣ CabinClass
-- ===============================
INSERT INTO CabinClass (classId, className, priceMultiplier, availableSeats)
VALUES
('C01', 'Economy', 1.0, 120),
('C02', 'Premium Economy', 1.4, 60),
('C03', 'Business', 2.0, 25),
('C04', 'First', 3.0, 10);

-- ===============================
-- 5️⃣ FlightCabinClass
-- ===============================
INSERT INTO FlightCabinClass (cabinId, flightId)
VALUES
('C01', 'FL001'), ('C02', 'FL001'),
('C01', 'FL002'), ('C03', 'FL003'),
('C01', 'FL004'), ('C02', 'FL004'),
('C01', 'FL005'), ('C03', 'FL005'),
('C01', 'FL006'), ('C03', 'FL006'),
('C02', 'FL007'), ('C03', 'FL007'),
('C01', 'FL008'), ('C04', 'FL008'),
('C01', 'FL009'), ('C02', 'FL010');

-- ===============================
-- 6️⃣ Booking
-- ===============================
INSERT INTO Booking (bookingId, bookingDate, totalPrice, status, userId)
VALUES
('BK001', '2025-07-10', 811.56, 'Success', 'USR001'),
('BK002', '2025-08-01', 980.00, 'Pending', 'USR002'),
('BK003', '2025-09-02', 340.00, 'Success', 'USR003'),
('BK004', '2025-10-05', 1250.00, 'Success', 'USR004'),
('BK005', '2025-10-12', 2100.00, 'Success', 'USR005'),
('BK006', '2025-11-01', 920.00, 'Pending', 'USR006'),
('BK007', '2025-11-05', 1700.00, 'Success', 'USR007'),
('BK008', '2025-12-02', 310.00, 'Success', 'USR008');

-- ===============================
-- 7️⃣ FlightBooking
-- ===============================
INSERT INTO FlightBooking (flightId, bookingId)
VALUES
('FL001', 'BK001'),
('FL002', 'BK001'),
('FL003', 'BK002'),
('FL004', 'BK003'),
('FL005', 'BK004'),
('FL006', 'BK005'),
('FL007', 'BK006'),
('FL008', 'BK007'),
('FL009', 'BK008'),
('FL010', 'BK008');

-- ===============================
-- 8️⃣ Passenger
-- ===============================
INSERT INTO Passenger (passengerId, fullName, gender, dateOfBirth, nationality, idNumber)
VALUES
('PS001', 'Pedro Moreno', 'Male', '1992-03-10', 'USA', 'IDUSA12345'),
('PS002', 'Anna Skylar', 'Female', '1988-08-22', 'UK', 'UKID99877'),
('PS003', 'John Carter', 'Male', '1990-11-02', 'Australia', 'AUID99822'),
('PS004', 'Lucy Park', 'Female', '1995-06-20', 'Korea', 'KRID55677'),
('PS005', 'Michael Brown', 'Male', '1985-01-15', 'France', 'FRID88566'),
('PS006', 'Emily Johnson', 'Female', '1993-12-02', 'Canada', 'CAID22119'),
('PS007', 'Thomas Reed', 'Male', '1991-07-08', 'Germany', 'DEID44288'),
('PS008', 'Sofia Kim', 'Female', '1994-05-11', 'Singapore', 'SGID33077');

-- ===============================
-- 9️⃣ BookingPassenger
-- ===============================
INSERT INTO BookingPassenger (bookingId, passengerId)
VALUES
('BK001', 'PS001'),
('BK002', 'PS002'),
('BK003', 'PS003'),
('BK004', 'PS004'),
('BK005', 'PS005'),
('BK006', 'PS006'),
('BK007', 'PS007'),
('BK008', 'PS008');

-- ===============================
-- 🔟 SeatSelection
-- ===============================
INSERT INTO SeatSelection (seatId, seatNumber, status, cabinId, bookingId)
VALUES
('ST001', '03C', 'Selected', 'C01', 'BK001'),
('ST002', '12A', 'Selected', 'C03', 'BK002'),
('ST003', '07D', 'Selected', 'C02', 'BK003'),
('ST004', '02A', 'Selected', 'C03', 'BK004'),
('ST005', '01B', 'Selected', 'C03', 'BK005'),
('ST006', '10F', 'Selected', 'C02', 'BK006'),
('ST007', '04C', 'Selected', 'C04', 'BK007'),
('ST008', '22D', 'Selected', 'C01', 'BK008');

-- ===============================
-- 11️⃣ Baggage
-- ===============================
INSERT INTO Baggage (baggageId, weight, price, type, bookingId)
VALUES
('BG001', '22 lbs', 19.99, 'Checked', 'BK001'),
('BG002', '15 lbs', 0.00, 'Personal', 'BK001'),
('BG003', '25 lbs', 25.00, 'Checked', 'BK002'),
('BG004', '18 lbs', 0.00, 'Personal', 'BK003'),
('BG005', '32 lbs', 30.00, 'Checked', 'BK004'),
('BG006', '10 lbs', 0.00, 'Personal', 'BK005'),
('BG007', '40 lbs', 45.00, 'Checked', 'BK006'),
('BG008', '12 lbs', 0.00, 'Personal', 'BK007'),
('BG009', '20 lbs', 0.00, 'Carry-on', 'BK008');

-- ===============================
-- 12️⃣ Payment
-- ===============================
INSERT INTO Payment (paymentId, amount, status, transactionTime, bankTransactionId, bookingId)
VALUES
('PM001', 811.56, 'Completed', '2025-07-10 09:30:00', 'TXN56781', 'BK001'),
('PM002', 980.00, 'Pending', '2025-08-01 15:45:00', 'TXN98211', 'BK002'),
('PM003', 340.00, 'Completed', '2025-09-02 12:10:00', 'TXN34077', 'BK003'),
('PM004', 1250.00, 'Completed', '2025-10-05 19:45:00', 'TXN55555', 'BK004'),
('PM005', 2100.00, 'Completed', '2025-10-12 20:30:00', 'TXN66666', 'BK005'),
('PM006', 920.00, 'Pending', '2025-11-01 08:00:00', 'TXN77777', 'BK006'),
('PM007', 1700.00, 'Completed', '2025-11-05 14:20:00', 'TXN88888', 'BK007'),
('PM008', 310.00, 'Completed', '2025-12-02 10:10:00', 'TXN99999', 'BK008');
