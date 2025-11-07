CREATE DATABASE IF NOT EXISTS flight_booking;
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

-- ===============================
-- 🔄 Thêm 50 chuyến bay mới (từ FL011 → FL060)
-- ===============================
INSERT INTO Flight (flightId, flightCode, departureAirport, arrivalAirport, departureTime, arrivalTime, duration, tripType, airline, basePrice, stopCount)
VALUES
-- 🔸 2025-11-08 (nhiều chuyến trong 1 ngày)
('FL011', 'SGNHAN', 'Tan Son Nhat', 'Noi Bai', '2025-11-08 07:00:00', '2025-11-08 09:00:00', 120, 'One-way', 'VietnamAir', 120.00, 0),
('FL012', 'HANSGN', 'Noi Bai', 'Tan Son Nhat', '2025-11-08 11:00:00', '2025-11-08 13:00:00', 120, 'Round-trip', 'BambooAir', 125.00, 0),
('FL013', 'SGNDAD', 'Tan Son Nhat', 'Da Nang', '2025-11-08 14:00:00', '2025-11-08 15:30:00', 90, 'Multi-city', 'VietJet', 90.00, 0),

-- 🔸 2025-11-09
('FL014', 'DADSGN', 'Da Nang', 'Tan Son Nhat', '2025-11-09 09:00:00', '2025-11-09 10:30:00', 90, 'Round-trip', 'VietJet', 90.00, 0),
('FL015', 'SGNREP', 'Tan Son Nhat', 'Siem Reap', '2025-11-09 11:00:00', '2025-11-09 12:15:00', 75, 'One-way', 'CambodiaAngkor', 140.00, 0),

-- 🔸 2025-11-10
('FL016', 'REPSGN', 'Siem Reap', 'Tan Son Nhat', '2025-11-10 09:00:00', '2025-11-10 10:15:00', 75, 'Round-trip', 'CambodiaAngkor', 140.00, 0),
('FL017', 'HANBKK', 'Noi Bai', 'Bangkok', '2025-11-10 06:00:00', '2025-11-10 08:00:00', 120, 'One-way', 'ThaiSmile', 160.00, 0),

-- 🔸 2025-11-11
('FL018', 'BKKSIN', 'Bangkok', 'Singapore', '2025-11-11 10:00:00', '2025-11-11 13:00:00', 180, 'Multi-city', 'SingaporeAir', 230.00, 0),
('FL019', 'SINBKK', 'Singapore', 'Bangkok', '2025-11-11 14:00:00', '2025-11-11 17:00:00', 180, 'Round-trip', 'SingaporeAir', 230.00, 0),

-- 🔸 2025-11-12
('FL020', 'HANHKG', 'Noi Bai', 'Hong Kong', '2025-11-12 09:00:00', '2025-11-12 13:00:00', 240, 'One-way', 'Cathay', 260.00, 0),
('FL021', 'HKGHAN', 'Hong Kong', 'Noi Bai', '2025-11-12 15:00:00', '2025-11-12 19:00:00', 240, 'Round-trip', 'Cathay', 260.00, 0),

-- 🔸 2025-11-13
('FL022', 'SGNTPE', 'Tan Son Nhat', 'Taipei', '2025-11-13 06:30:00', '2025-11-13 10:45:00', 255, 'Multi-city', 'EvaAir', 330.00, 0),
('FL023', 'TPESGN', 'Taipei', 'Tan Son Nhat', '2025-11-13 13:00:00', '2025-11-13 17:15:00', 255, 'Round-trip', 'EvaAir', 330.00, 0),

-- 🔸 2025-11-14 (ngày có nhiều chuyến)
('FL024', 'HANICN', 'Noi Bai', 'Seoul Incheon', '2025-11-14 07:30:00', '2025-11-14 14:00:00', 390, 'One-way', 'KoreanAir', 400.00, 0),
('FL025', 'ICNHAN', 'Seoul Incheon', 'Noi Bai', '2025-11-14 15:00:00', '2025-11-14 21:00:00', 360, 'Round-trip', 'Asiana', 390.00, 0),
('FL026', 'SGNHKG', 'Tan Son Nhat', 'Hong Kong', '2025-11-14 08:00:00', '2025-11-14 12:30:00', 270, 'Multi-city', 'Cathay', 280.00, 0),
('FL027', 'SGNSIN', 'Tan Son Nhat', 'Singapore', '2025-11-14 14:00:00', '2025-11-14 17:00:00', 180, 'One-way', 'SingaporeAir', 210.00, 0),
('FL028', 'SINDPS', 'Singapore', 'Bali Denpasar', '2025-11-14 18:00:00', '2025-11-14 20:00:00', 120, 'Multi-city', 'Garuda', 180.00, 0),

-- 🔸 2025-11-15
('FL029', 'DPSPER', 'Bali Denpasar', 'Perth', '2025-11-15 08:00:00', '2025-11-15 12:00:00', 240, 'One-way', 'JetStar', 200.00, 0),
('FL030', 'PERDPS', 'Perth', 'Bali Denpasar', '2025-11-15 14:00:00', '2025-11-15 18:00:00', 240, 'Round-trip', 'JetStar', 200.00, 0),

-- 🔸 2025-11-16 ~ 2025-11-20 (thêm nhiều flight ngẫu nhiên)
('FL031', 'SGNSYD', 'Tan Son Nhat', 'Sydney', '2025-11-16 09:00:00', '2025-11-16 19:00:00', 600, 'One-way', 'Qantas', 750.00, 0),
('FL032', 'SYDSGN', 'Sydney', 'Tan Son Nhat', '2025-11-16 20:00:00', '2025-11-17 06:00:00', 600, 'Round-trip', 'Qantas', 750.00, 0),
('FL033', 'HANCDG', 'Noi Bai', 'Paris CDG', '2025-11-17 23:00:00', '2025-11-18 06:30:00', 510, 'One-way', 'AirFrance', 850.00, 0),
('FL034', 'CDGHAN', 'Paris CDG', 'Noi Bai', '2025-11-18 09:00:00', '2025-11-18 17:00:00', 480, 'Round-trip', 'AirFrance', 850.00, 0),
('FL035', 'SGNDOH', 'Tan Son Nhat', 'Doha', '2025-11-19 01:00:00', '2025-11-19 05:00:00', 240, 'Multi-city', 'QatarAir', 700.00, 0),
('FL036', 'DOHLHR', 'Doha', 'London Heathrow', '2025-11-19 07:00:00', '2025-11-19 13:00:00', 360, 'Multi-city', 'QatarAir', 800.00, 0),
('FL037', 'LHRJFK', 'London Heathrow', 'John F Kennedy', '2025-11-20 08:00:00', '2025-11-20 15:00:00', 420, 'One-way', 'BritishAir', 650.00, 0),
('FL038', 'JFKLHR', 'John F Kennedy', 'London Heathrow', '2025-11-20 18:00:00', '2025-11-21 05:00:00', 420, 'Round-trip', 'BritishAir', 650.00, 0),
('FL039', 'SGNDXB', 'Tan Son Nhat', 'Dubai', '2025-11-21 00:00:00', '2025-11-21 04:30:00', 270, 'One-way', 'Emirates', 680.00, 0),
('FL040', 'DXBSGN', 'Dubai', 'Tan Son Nhat', '2025-11-22 00:00:00', '2025-11-22 04:30:00', 270, 'Round-trip', 'Emirates', 680.00, 0),

-- 🔸 2025-11-23 ~ 2025-12-05 (chuyến dài & đa dạng)
('FL041', 'SGNKUL', 'Tan Son Nhat', 'Kuala Lumpur', '2025-11-23 10:00:00', '2025-11-23 13:00:00', 180, 'One-way', 'AirAsia', 100.00, 0),
('FL042', 'KULSGN', 'Kuala Lumpur', 'Tan Son Nhat', '2025-11-23 15:00:00', '2025-11-23 18:00:00', 180, 'Round-trip', 'AirAsia', 100.00, 0),
('FL043', 'HANPEK', 'Noi Bai', 'Beijing', '2025-11-24 07:30:00', '2025-11-24 12:00:00', 270, 'One-way', 'ChinaAir', 260.00, 0),
('FL044', 'PEKHAN', 'Beijing', 'Noi Bai', '2025-11-25 09:00:00', '2025-11-25 13:30:00', 270, 'Round-trip', 'ChinaAir', 260.00, 0),
('FL045', 'SGNICN', 'Tan Son Nhat', 'Seoul Incheon', '2025-11-26 06:30:00', '2025-11-26 14:00:00', 450, 'Multi-city', 'VietravelAir', 420.00, 0),
('FL046', 'ICNTYO', 'Seoul Incheon', 'Tokyo Haneda', '2025-11-26 15:00:00', '2025-11-26 18:30:00', 210, 'Multi-city', 'VietravelAir', 420.00, 0),
('FL047', 'TYOSGN', 'Tokyo Haneda', 'Tan Son Nhat', '2025-11-27 08:00:00', '2025-11-27 14:00:00', 360, 'Round-trip', 'JapanAir', 550.00, 0),
('FL048', 'SGNHKT', 'Tan Son Nhat', 'Phuket', '2025-11-28 09:00:00', '2025-11-28 10:30:00', 90, 'One-way', 'ThaiVietJet', 120.00, 0),
('FL049', 'HKTSGN', 'Phuket', 'Tan Son Nhat', '2025-11-28 14:00:00', '2025-11-28 15:30:00', 90, 'Round-trip', 'ThaiVietJet', 120.00, 0),
('FL050', 'SGNDEL', 'Tan Son Nhat', 'Delhi', '2025-11-30 06:00:00', '2025-11-30 11:00:00', 300, 'One-way', 'Indigo', 310.00, 0),
('FL051', 'DELSGN', 'Delhi', 'Tan Son Nhat', '2025-11-30 14:00:00', '2025-11-30 19:00:00', 300, 'Round-trip', 'Indigo', 310.00, 0),
('FL052', 'SGNYVR', 'Tan Son Nhat', 'Vancouver', '2025-12-01 22:00:00', '2025-12-02 08:00:00', 600, 'One-way', 'AirCanada', 890.00, 0),
('FL053', 'YVRSGN', 'Vancouver', 'Tan Son Nhat', '2025-12-03 23:00:00', '2025-12-04 10:00:00', 660, 'Round-trip', 'AirCanada', 890.00, 0),
('FL054', 'SGNSFO', 'Tan Son Nhat', 'San Francisco', '2025-12-05 22:00:00', '2025-12-06 10:00:00', 720, 'One-way', 'United', 950.00, 0),
('FL055', 'SFOSGN', 'San Francisco', 'Tan Son Nhat', '2025-12-07 13:00:00', '2025-12-08 03:00:00', 720, 'Round-trip', 'United', 950.00, 0),
('FL056', 'SGNFRA', 'Tan Son Nhat', 'Frankfurt', '2025-12-09 23:00:00', '2025-12-10 06:00:00', 480, 'One-way', 'Lufthansa', 880.00, 0),
('FL057', 'FRASGN', 'Frankfurt', 'Tan Son Nhat', '2025-12-11 09:00:00', '2025-12-11 16:00:00', 480, 'Round-trip', 'Lufthansa', 880.00, 0),
('FL058', 'SGNZRH', 'Tan Son Nhat', 'Zurich', '2025-12-12 00:00:00', '2025-12-12 06:30:00', 390, 'Multi-city', 'SwissAir', 910.00, 0),
('FL059', 'ZRHLAX', 'Zurich', 'Los Angeles', '2025-12-13 08:00:00', '2025-12-13 18:00:00', 600, 'Multi-city', 'SwissAir', 980.00, 0),
('FL060', 'LAXSGN', 'Los Angeles', 'Tan Son Nhat', '2025-12-15 09:00:00', '2025-12-16 18:00:00', 540, 'Round-trip', 'VietnamAir', 970.00, 0);


-- Xóa dữ liệu cũ nếu cần
DELETE FROM Flight;

-- ================================
-- ✈ ONE-WAY FLIGHTS
-- ================================
INSERT INTO Flight (flightId, flightCode, departureAirport, arrivalAirport, departureTime, arrivalTime, duration, tripType, airline, basePrice, stopCount)
VALUES
('FL101', 'VN210', 'Tan Son Nhat', 'Noi Bai', '2025-11-20 06:00:00', '2025-11-20 08:10:00', 130, 'one-way', 'Vietnam Airlines', 85.00, 0),
('FL102', 'VJ122', 'Tan Son Nhat', 'Noi Bai', '2025-11-20 09:00:00', '2025-11-20 11:15:00', 135, 'one-way', 'VietJet Air', 60.00, 0),
('FL103', 'QH212', 'Tan Son Nhat', 'Noi Bai', '2025-11-20 13:30:00', '2025-11-20 15:40:00', 130, 'one-way', 'Bamboo Airways', 75.00, 0),
('FL104', 'VN214', 'Tan Son Nhat', 'Noi Bai', '2025-11-20 18:00:00', '2025-11-20 20:10:00', 130, 'one-way', 'Vietnam Airlines', 95.00, 0),

('FL105', 'VN217', 'Noi Bai', 'Tan Son Nhat', '2025-11-20 07:00:00', '2025-11-20 09:10:00', 130, 'one-way', 'Vietnam Airlines', 90.00, 0),
('FL106', 'VJ123', 'Noi Bai', 'Tan Son Nhat', '2025-11-20 11:30:00', '2025-11-20 13:40:00', 130, 'one-way', 'VietJet Air', 65.00, 0),
('FL107', 'QH218', 'Noi Bai', 'Tan Son Nhat', '2025-11-20 19:00:00', '2025-11-20 21:10:00', 130, 'one-way', 'Bamboo Airways', 80.00, 0),

('FL108', 'VN312', 'Tan Son Nhat', 'Da Nang', '2025-11-20 07:00:00', '2025-11-20 08:15:00', 75, 'one-way', 'Vietnam Airlines', 70.00, 0),
('FL109', 'VJ620', 'Tan Son Nhat', 'Da Nang', '2025-11-20 12:00:00', '2025-11-20 13:20:00', 80, 'one-way', 'VietJet Air', 55.00, 0),
('FL110', 'QH152', 'Tan Son Nhat', 'Da Nang', '2025-11-20 18:30:00', '2025-11-20 19:50:00', 80, 'one-way', 'Bamboo Airways', 68.00, 0);

-- ================================
-- 🔁 ROUND-TRIP FLIGHTS (Khứ hồi)
-- ================================
INSERT INTO Flight (flightId, flightCode, departureAirport, arrivalAirport, departureTime, arrivalTime, duration, tripType, airline, basePrice, stopCount)
VALUES
-- SGN <-> HAN
('FL201', 'VN220', 'Tan Son Nhat', 'Noi Bai', '2025-11-25 08:00:00', '2025-11-25 10:10:00', 130, 'round-trip', 'Vietnam Airlines', 170.00, 0),
('FL202', 'VN221', 'Noi Bai', 'Tan Son Nhat', '2025-11-28 17:00:00', '2025-11-28 19:15:00', 135, 'round-trip', 'Vietnam Airlines', 170.00, 0),

-- HAN <-> DAD
('FL203', 'VJ450', 'Noi Bai', 'Da Nang', '2025-11-26 09:30:00', '2025-11-26 10:45:00', 75, 'round-trip', 'VietJet Air', 120.00, 0),
('FL204', 'VJ451', 'Da Nang', 'Noi Bai', '2025-11-29 18:00:00', '2025-11-29 19:15:00', 75, 'round-trip', 'VietJet Air', 120.00, 0),

-- SGN <-> DAD
('FL205', 'QH320', 'Tan Son Nhat', 'Da Nang', '2025-11-24 10:00:00', '2025-11-24 11:15:00', 75, 'round-trip', 'Bamboo Airways', 140.00, 0),
('FL206', 'QH321', 'Da Nang', 'Tan Son Nhat', '2025-11-27 15:30:00', '2025-11-27 16:45:00', 75, 'round-trip', 'Bamboo Airways', 140.00, 0);

-- ================================
-- 🌍 MULTI-CITY FLIGHTS
-- ================================
INSERT INTO Flight (flightId, flightCode, departureAirport, arrivalAirport, departureTime, arrivalTime, duration, tripType, airline, basePrice, stopCount)
VALUES
-- SGN -> DOH -> LHR
('FL301', 'QR971', 'Tan Son Nhat', 'Doha', '2025-11-21 00:30:00', '2025-11-21 05:00:00', 510, 'multi-city', 'Qatar Airways', 680.00, 0),
('FL302', 'QR7',   'Doha', 'London Heathrow', '2025-11-21 07:10:00', '2025-11-21 12:20:00', 430, 'multi-city', 'Qatar Airways', 750.00, 0),

-- HAN -> BKK -> SIN
('FL303', 'TG561', 'Noi Bai', 'Bangkok', '2025-11-22 09:00:00', '2025-11-22 11:00:00', 120, 'multi-city', 'Thai Airways', 150.00, 0),
('FL304', 'SQ981', 'Bangkok', 'Singapore', '2025-11-22 13:00:00', '2025-11-22 16:15:00', 195, 'multi-city', 'Singapore Airlines', 180.00, 0),

-- SGN -> HKG -> TYO
('FL305', 'CX764', 'Tan Son Nhat', 'Hong Kong', '2025-11-23 08:00:00', '2025-11-23 11:30:00', 210, 'multi-city', 'Cathay Pacific', 230.00, 0),
('FL306', 'JL704', 'Hong Kong', 'Tokyo', '2025-11-23 13:00:00', '2025-11-23 18:00:00', 300, 'multi-city', 'Japan Airlines', 400.00, 0);
