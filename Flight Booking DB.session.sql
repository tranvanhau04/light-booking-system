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


-- Thêm cột seatMap kiểu JSON vào bảng FlightCabinClass
ALTER TABLE FlightCabinClass
ADD COLUMN seatMap JSON;

-- (Tùy chọn) Sửa bảng SeatSelection để liên kết đúng
-- Bạn nên thêm flightId vào đây để biết ghế này thuộc chuyến bay nào
ALTER TABLE SeatSelection
ADD COLUMN flightId VARCHAR(10);

ALTER TABLE SeatSelection
ADD FOREIGN KEY (flightId) REFERENCES Flight(flightId);

-- 1. Sơ đồ ghế cho Economy (C01) trên chuyến bay FL001
-- Dữ liệu của bạn: Ghế '03C' đã được đặt (BK001)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "01A", "isAvailable": true}, {"seatNumber": "01B", "isAvailable": true}, {"seatNumber": "01C", "isAvailable": true},
  {"seatNumber": "01D", "isAvailable": true}, {"seatNumber": "01E", "isAvailable": true}, {"seatNumber": "01F", "isAvailable": true},
  {"seatNumber": "02A", "isAvailable": true}, {"seatNumber": "02B", "isAvailable": false}, {"seatNumber": "02C", "isAvailable": true},
  {"seatNumber": "02D", "isAvailable": true}, {"seatNumber": "02E", "isAvailable": true}, {"seatNumber": "02F", "isAvailable": true},
  {"seatNumber": "03A", "isAvailable": true}, {"seatNumber": "03B", "isAvailable": true}, {"seatNumber": "03C", "isAvailable": false},
  {"seatNumber": "03D", "isAvailable": true}, {"seatNumber": "03E", "isAvailable": true}, {"seatNumber": "03F", "isAvailable": true},
  {"seatNumber": "04A", "isAvailable": true}, {"seatNumber": "04B", "isAvailable": true}, {"seatNumber": "04C", "isAvailable": true},
  {"seatNumber": "04D", "isAvailable": true}, {"seatNumber": "04E", "isAvailable": false}, {"seatNumber": "04F", "isAvailable": true}
]'
WHERE flightId = 'FL001' AND cabinId = 'C01';

-- 2. Sơ đồ ghế cho Business (C03) trên chuyến bay FL003
-- Dữ liệu của bạn: Ghế '12A' đã được đặt (BK002)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "10A", "isAvailable": true}, 
  {"seatNumber": "10E", "isAvailable": true}, {"seatNumber": "10F", "isAvailable": true},
  {"seatNumber": "10K", "isAvailable": true},
  {"seatNumber": "11A", "isAvailable": false}, 
  {"seatNumber": "11E", "isAvailable": true}, {"seatNumber": "11F", "isAvailable": true},
  {"seatNumber": "11K", "isAvailable": true},
  {"seatNumber": "12A", "isAvailable": false}, 
  {"seatNumber": "12E", "isAvailable": true}, {"seatNumber": "12F", "isAvailable": true},
  {"seatNumber": "12K", "isAvailable": true}
]'
WHERE flightId = 'FL003' AND cabinId = 'C03';

-- 3. Sơ đồ ghế cho Premium Economy (C02) trên chuyến bay FL004
-- Dữ liệu của bạn: Ghế '07D' đã được đặt (BK003)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "07A", "isAvailable": true}, {"seatNumber": "07C", "isAvailable": true},
  {"seatNumber": "07D", "isAvailable": false}, {"seatNumber": "07E", "isAvailable": true}, {"seatNumber": "07F", "isAvailable": true},
  {"seatNumber": "07H", "isAvailable": true}, {"seatNumber": "07K", "isAvailable": true},
  {"seatNumber": "08A", "isAvailable": true}, {"seatNumber": "08C", "isAvailable": false},
  {"seatNumber": "08D", "isAvailable": true}, {"seatNumber": "08E", "isAvailable": true}, {"seatNumber": "08F", "isAvailable": true},
  {"seatNumber": "08H", "isAvailable": true}, {"seatNumber": "08K", "isAvailable": true}
]'
WHERE flightId = 'FL004' AND cabinId = 'C02';

-- 4. Sơ đồ ghế cho First (C04) trên chuyến bay FL008
-- Dữ liệu của bạn: Ghế '04C' đã được đặt (BK007)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "01A", "isAvailable": true}, {"seatNumber": "01K", "isAvailable": true},
  {"seatNumber": "02A", "isAvailable": true}, {"seatNumber": "02K", "isAvailable": true},
  {"seatNumber": "03A", "isAvailable": true}, {"seatNumber": "03K", "isAvailable": false},
  {"seatNumber": "04A", "isAvailable": true}, {"seatNumber": "04C", "isAvailable": false}
]'
WHERE flightId = 'FL008' AND cabinId = 'C04';

-- 5. Sơ đồ ghế cho Economy (C01) trên chuyến bay FL009
-- Dữ liệu của bạn: Ghế '22D' đã được đặt (BK008)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "20A", "isAvailable": true}, {"seatNumber": "20B", "isAvailable": true}, {"seatNumber": "20C", "isAvailable": true},
  {"seatNumber": "20D", "isAvailable": true}, {"seatNumber": "20E", "isAvailable": true}, {"seatNumber": "20F", "isAvailable": true},
  {"seatNumber": "21A", "isAvailable": true}, {"seatNumber": "21B", "isAvailable": true}, {"seatNumber": "21C", "isAvailable": true},
  {"seatNumber": "21D", "isAvailable": false}, {"seatNumber": "21E", "isAvailable": true}, {"seatNumber": "21F", "isAvailable": true},
  {"seatNumber": "22A", "isAvailable": true}, {"seatNumber": "22B", "isAvailable": true}, {"seatNumber": "22C", "isAvailable": true},
  {"seatNumber": "22D", "isAvailable": false}, {"seatNumber": "22E", "isAvailable": true}, {"seatNumber": "22F", "isAvailable": true}
]'
WHERE flightId = 'FL009' AND cabinId = 'C01';







-- === Hạng Economy (C01) ===

-- Sơ đồ ghế cho ('FL002', 'C01')
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "20A", "isAvailable": true}, {"seatNumber": "20B", "isAvailable": true}, {"seatNumber": "20C", "isAvailable": true},
  {"seatNumber": "21A", "isAvailable": true}, {"seatNumber": "21B", "isAvailable": false}, {"seatNumber": "21C", "isAvailable": true},
  {"seatNumber": "22A", "isAvailable": true}, {"seatNumber": "22B", "isAvailable": true}, {"seatNumber": "22C", "isAvailable": true}
]'
WHERE flightId = 'FL002' AND cabinId = 'C01';

-- Sơ đồ ghế cho ('FL004', 'C01')
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "15A", "isAvailable": true}, {"seatNumber": "15B", "isAvailable": true}, {"seatNumber": "15C", "isAvailable": true},
  {"seatNumber": "16A", "isAvailable": true}, {"seatNumber": "16B", "isAvailable": false}, {"seatNumber": "16C", "isAvailable": true},
  {"seatNumber": "17A", "isAvailable": true}, {"seatNumber": "17B", "isAvailable": true}, {"seatNumber": "17C", "isAvailable": true}
]'
WHERE flightId = 'FL004' AND cabinId = 'C01';

-- Sơ đồ ghế cho ('FL005', 'C01')
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "30A", "isAvailable": true}, {"seatNumber": "30B", "isAvailable": true}, {"seatNumber": "30C", "isAvailable": true},
  {"seatNumber": "31A", "isAvailable": true}, {"seatNumber": "31B", "isAvailable": true}, {"seatNumber": "31C", "isAvailable": true}
]'
WHERE flightId = 'FL005' AND cabinId = 'C01';

-- Sơ đồ ghế cho ('FL006', 'C01')
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "30A", "isAvailable": true}, {"seatNumber": "30B", "isAvailable": true}, {"seatNumber": "30C", "isAvailable": true},
  {"seatNumber": "31A", "isAvailable": true}, {"seatNumber": "31B", "isAvailable": false}, {"seatNumber": "31C", "isAvailable": true}
]'
WHERE flightId = 'FL006' AND cabinId = 'C01';

-- Sơ đồ ghế cho ('FL008', 'C01')
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "25A", "isAvailable": true}, {"seatNumber": "25B", "isAvailable": true}, {"seatNumber": "25C", "isAvailable": true},
  {"seatNumber": "26A", "isAvailable": true}, {"seatNumber": "26B", "isAvailable": true}, {"seatNumber": "26C", "isAvailable": true}
]'
WHERE flightId = 'FL008' AND cabinId = 'C01';

-- === Hạng Premium Economy (C02) ===

-- Sơ đồ ghế cho ('FL001', 'C02')
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "10A", "isAvailable": true}, {"seatNumber": "10C", "isAvailable": true},
  {"seatNumber": "10D", "isAvailable": false}, {"seatNumber": "10E", "isAvailable": true}, {"seatNumber": "10F", "isAvailable": true},
  {"seatNumber": "11A", "isAvailable": true}, {"seatNumber": "11C", "isAvailable": true},
  {"seatNumber": "11D", "isAvailable": true}, {"seatNumber": "11E", "isAvailable": true}, {"seatNumber": "11F", "isAvailable": true}
]'
WHERE flightId = 'FL001' AND cabinId = 'C02';

-- Sơ đồ ghế cho ('FL007', 'C02')
-- Dữ liệu của bạn: Ghế '10F' đã được đặt (BK006)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "10A", "isAvailable": true}, {"seatNumber": "10C", "isAvailable": true},
  {"seatNumber": "10D", "isAvailable": true}, {"seatNumber": "10E", "isAvailable": true}, {"seatNumber": "10F", "isAvailable": false},
  {"seatNumber": "11A", "isAvailable": true}, {"seatNumber": "11C", "isAvailable": true},
  {"seatNumber": "11D", "isAvailable": true}, {"seatNumber": "11E", "isAvailable": true}, {"seatNumber": "11F", "isAvailable": true}
]'
WHERE flightId = 'FL007' AND cabinId = 'C02';

-- Sơ đồ ghế cho ('FL010', 'C02')
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "12A", "isAvailable": true}, {"seatNumber": "12C", "isAvailable": true},
  {"seatNumber": "12D", "isAvailable": true}, {"seatNumber": "12E", "isAvailable": true}, {"seatNumber": "12F", "isAvailable": true},
  {"seatNumber": "14A", "isAvailable": true}, {"seatNumber": "14C", "isAvailable": true},
  {"seatNumber": "14D", "isAvailable": true}, {"seatNumber": "14E", "isAvailable": true}, {"seatNumber": "14F", "isAvailable": true}
]'
WHERE flightId = 'FL010' AND cabinId = 'C02';

-- === Hạng Business (C03) ===

-- Sơ đồ ghế cho ('FL005', 'C03')
-- Dữ liệu của bạn: Ghế '02A' đã được đặt (BK004)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "01A", "isAvailable": true}, {"seatNumber": "01K", "isAvailable": true},
  {"seatNumber": "02A", "isAvailable": false}, {"seatNumber": "02K", "isAvailable": true},
  {"seatNumber": "03A", "isAvailable": true}, {"seatNumber": "03K", "isAvailable": true},
  {"seatNumber": "04A", "isAvailable": true}, {"seatNumber": "04K", "isAvailable": false}
]'
WHERE flightId = 'FL005' AND cabinId = 'C03';

-- Sơ đồ ghế cho ('FL006', 'C03')
-- Dữ liệu của bạn: Ghế '01B' đã được đặt (BK005)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "01A", "isAvailable": true}, {"seatNumber": "01B", "isAvailable": false},
  {"seatNumber": "02A", "isAvailable": true}, {"seatNumber": "02B", "isAvailable": true},
  {"seatNumber": "03A", "isAvailable": true}, {"seatNumber": "03B", "isAvailable": true},
  {"seatNumber": "04A", "isAvailable": true}, {"seatNumber": "04B", "isAvailable": true}
]'
WHERE flightId = 'FL006' AND cabinId = 'C03';

-- Sơ đồ ghế cho ('FL007', 'C03')
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "05A", "isAvailable": true}, {"seatNumber": "05K", "isAvailable": true},
  {"seatNumber": "06A", "isAvailable": true}, {"seatNumber": "06K", "isAvailable": true},
  {"seatNumber": "07A", "isAvailable": true}, {"seatNumber": "07K", "isAvailable": false},
  {"seatNumber": "08A", "isAvailable": true}, {"seatNumber": "08K", "isAvailable": true}
]'
WHERE flightId = 'FL007' AND cabinId = 'C03';

use flight_booking;
-- 1. TẠO BẢNG "MENU" (NẾU BẠN CHƯA TẠO)
CREATE TABLE IF NOT EXISTS BaggageOption (
    optionId VARCHAR(10) PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    weight VARCHAR(50), -- (Tăng độ dài để chứa "Max weight 22.1 lbs")
    price DOUBLE NOT NULL
);

-- 2. "ĐẨY" (INSERT) DATA CỦA GIAO DIỆN MẪU VÀO "MENU"
-- (Xóa data cũ đi nếu có)
TRUNCATE TABLE BaggageOption; 

INSERT INTO BaggageOption (optionId, type, weight, price)
VALUES
('BG_PER', 'Personal', 'Included per traveller', 0.00),
('BG_CHK1', 'Checked', '1 checked bag (Max weight 22.1 lbs)', 19.99),
('BG_NONE', 'No Checked', '$00.00', 0.00);