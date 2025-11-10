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




-- ===================================================================
-- PHẦN 2: THÊM 100 CHUYẾN BAY MỚI (KHÔNG CÓ DỮ LIỆU NULL)
-- ===================================================================

-- ===============================
-- 16️⃣ 100 CHUYẾN BAY MỚI
-- ===============================
INSERT INTO Flight (flightId, flightCode, departureAirport, arrivalAirport, departureTime, arrivalTime, duration, tripType, airline, basePrice, stopCount)
VALUES
('FL011', 'SFOPEK', 'San Francisco', 'Beijing', '2026-01-10 14:00:00', '2026-01-11 18:00:00', 720, 'One-way', 'AirAsia', 750.00, 1),
('FL012', 'PEKSFO', 'Beijing', 'San Francisco', '2026-01-15 12:00:00', '2026-01-15 09:00:00', 780, 'Round-trip', 'AirAsia', 760.00, 1),
('FL013', 'DXBAMS', 'Dubai', 'Amsterdam', '2026-01-12 08:30:00', '2026-01-12 13:00:00', 270, 'One-way', 'Emirates', 500.00, 0),
('FL014', 'AMSBER', 'Amsterdam', 'Berlin', '2026-01-14 10:00:00', '2026-01-14 11:30:00', 90, 'One-way', 'Lufthansa', 120.00, 0),
('FL015', 'BERMAD', 'Berlin', 'Madrid', '2026-01-16 15:00:00', '2026-01-16 18:00:00', 180, 'One-way', 'Lufthansa', 180.00, 0),
('FL016', 'MADFCO', 'Madrid', 'Rome', '2026-01-18 09:00:00', '2026-01-18 11:30:00', 150, 'One-way', 'EcoWings', 130.00, 0),
('FL017', 'FCOYYZ', 'Rome', 'Toronto', '2026-01-20 11:00:00', '2026-01-20 15:00:00', 540, 'Round-trip', 'Air Canada', 800.00, 0),
('FL018', 'YYZFCO', 'Toronto', 'Rome', '2026-01-25 18:00:00', '2026-01-26 09:00:00', 540, 'Round-trip', 'Air Canada', 820.00, 0),
('FL019', 'YVRICN', 'Vancouver', 'Seoul Incheon', '2026-01-22 13:00:00', '2026-01-23 17:00:00', 720, 'One-way', 'KoreanAir', 900.00, 0),
('FL020', 'ICNYVR', 'Seoul Incheon', 'Vancouver', '2026-01-28 19:00:00', '2026-01-28 12:00:00', 660, 'Round-trip', 'KoreanAir', 910.00, 0),
('FL021', 'LCYCDG', 'London City', 'Paris CDG', '2026-02-01 07:00:00', '2026-02-01 09:15:00', 75, 'Round-trip', 'Air France', 150.00, 0),
('FL022', 'CDGLCY', 'Paris CDG', 'London City', '2026-02-05 19:00:00', '2026-02-05 21:15:00', 75, 'Round-trip', 'Air France', 155.00, 0),
('FL023', 'JFKSFO', 'John F Kennedy', 'San Francisco', '2026-02-03 08:00:00', '2026-02-03 11:30:00', 330, 'One-way', 'DeltaAir', 280.00, 0),
('FL024', 'LAXDXB', 'Los Angeles', 'Dubai', '2026-02-05 16:00:00', '2026-02-06 19:00:00', 960, 'One-way', 'Emirates', 1200.00, 0),
('FL025', 'DXBSYD', 'Dubai', 'Sydney', '2026-02-07 22:00:00', '2026-02-08 18:00:00', 840, 'One-way', 'Emirates', 1100.00, 0),
('FL026', 'SYDHKG', 'Sydney', 'Hong Kong', '2026-02-10 10:00:00', '2026-02-10 17:00:00', 540, 'One-way', 'Qantas', 600.00, 0),
('FL027', 'HKGSIN', 'Hong Kong', 'Singapore', '2026-02-12 09:00:00', '2026-02-12 13:00:00', 240, 'One-way', 'Scoot', 180.00, 0),
('FL028', 'SINHND', 'Singapore', 'Tokyo Haneda', '2026-02-14 23:00:00', '2026-02-15 07:00:00', 480, 'One-way', 'JapanAir', 450.00, 0),
('FL029', 'HNDBKK', 'Tokyo Haneda', 'Bangkok', '2026-02-16 11:00:00', '2026-02-16 16:00:00', 300, 'One-way', 'AirAsia', 300.00, 0),
('FL030', 'BKKLCY', 'Bangkok', 'London City', '2026-02-18 22:00:00', '2026-02-19 06:00:00', 840, 'One-way', 'SkyHaven', 900.00, 1),
('FL031', 'YYZLAX', 'Toronto', 'Los Angeles', '2026-02-20 10:00:00', '2026-02-20 12:30:00', 330, 'Round-trip', 'Air Canada', 400.00, 0),
('FL032', 'LAXYYZ', 'Los Angeles', 'Toronto', '2026-02-25 14:00:00', '2026-02-25 21:30:00', 330, 'Round-trip', 'Air Canada', 410.00, 0),
('FL033', 'MADJFK', 'Madrid', 'John F Kennedy', '2026-02-22 12:00:00', '2026-02-22 15:00:00', 480, 'One-way', 'EcoWings', 650.00, 0),
('FL034', 'BERDXB', 'Berlin', 'Dubai', '2026-02-24 13:00:00', '2026-02-24 21:30:00', 390, 'One-way', 'Lufthansa', 450.00, 0),
('FL035', 'FCOAMS', 'Rome', 'Amsterdam', '2026-02-26 09:00:00', '2026-02-26 11:30:00', 150, 'One-way', 'Lufthansa', 160.00, 0),
('FL036', 'AMSSFO', 'Amsterdam', 'San Francisco', '2026-02-28 11:00:00', '2026-02-28 14:00:00', 660, 'One-way', 'EcoWings', 700.00, 0),
('FL037', 'ICNPEK', 'Seoul Incheon', 'Beijing', '2026-03-01 08:00:00', '2026-03-01 10:00:00', 120, 'Round-trip', 'KoreanAir', 220.00, 0),
('FL038', 'PEKICN', 'Beijing', 'Seoul Incheon', '2026-03-05 11:00:00', '2026-03-05 13:00:00', 120, 'Round-trip', 'KoreanAir', 230.00, 0),
('FL039', 'SINSFO', 'Singapore', 'San Francisco', '2026-03-03 19:00:00', '2026-03-03 19:00:00', 960, 'One-way', 'SkyHaven', 950.00, 0),
('FL040', 'SFOSIN', 'San Francisco', 'Singapore', '2026-03-07 22:00:00', '2026-03-09 06:00:00', 960, 'Round-trip', 'SkyHaven', 980.00, 0),
('FL041', 'LCYBER', 'London City', 'Berlin', '2026-03-02 10:00:00', '2026-03-02 12:45:00', 105, 'One-way', 'Lufthansa', 140.00, 0),
('FL042', 'BERLCY', 'Berlin', 'London City', '2026-03-06 14:00:00', '2026-03-06 16:45:00', 105, 'Round-trip', 'Lufthansa', 145.00, 0),
('FL043', 'CDGDXB', 'Paris CDG', 'Dubai', '2026-03-04 15:00:00', '2026-03-04 23:30:00', 450, 'One-way', 'Air France', 550.00, 0),
('FL044', 'DXBCDG', 'Dubai', 'Paris CDG', '2026-03-08 03:00:00', '2026-03-08 07:30:00', 450, 'Round-trip', 'Emirates', 560.00, 0),
('FL045', 'JFKLAX', 'John F Kennedy', 'Los Angeles', '2026-03-10 09:00:00', '2026-03-10 12:30:00', 330, 'One-way', 'DeltaAir', 290.00, 0),
('FL046', 'LAXJFK', 'Los Angeles', 'John F Kennedy', '2026-03-15 14:00:00', '2026-03-15 22:00:00', 300, 'Round-trip', 'DeltaAir', 295.00, 0),
('FL047', 'SYDPEK', 'Sydney', 'Beijing', '2026-03-12 21:00:00', '2026-03-13 06:00:00', 660, 'One-way', 'Qantas', 800.00, 0),
('FL048', 'PEKSYD', 'Beijing', 'Sydney', '2026-03-17 09:00:00', '2026-03-17 22:00:00', 660, 'Round-trip', 'Qantas', 810.00, 0),
('FL049', 'HKGYVR', 'Hong Kong', 'Vancouver', '2026-03-14 01:00:00', '2026-03-14 20:00:00', 780, 'One-way', 'Air Canada', 850.00, 0),
('FL050', 'YVRHKG', 'Vancouver', 'Hong Kong', '2026-03-19 02:00:00', '2026-03-20 07:00:00', 780, 'Round-trip', 'Air Canada', 860.00, 0),
('FL051', 'BKKDXB', 'Bangkok', 'Dubai', '2026-03-16 03:00:00', '2026-03-16 06:30:00', 390, 'One-way', 'Emirates', 400.00, 0),
('FL052', 'DXBBKK', 'Dubai', 'Bangkok', '2026-03-21 09:00:00', '2026-03-21 18:30:00', 390, 'Round-trip', 'Emirates', 410.00, 0),
('FL053', 'HNDLAX', 'Tokyo Haneda', 'Los Angeles', '2026-03-18 17:00:00', '2026-03-18 10:00:00', 660, 'One-way', 'JapanAir', 750.00, 0),
('FL054', 'LAXHND', 'Los Angeles', 'Tokyo Haneda', '2026-03-23 13:00:00', '2026-03-24 17:00:00', 660, 'Round-trip', 'JapanAir', 760.00, 0),
('FL055', 'AMSJFK', 'Amsterdam', 'John F Kennedy', '2026-03-20 10:00:00', '2026-03-20 13:00:00', 480, 'One-way', 'EcoWings', 680.00, 0),
('FL056', 'JFKAMS', 'John F Kennedy', 'Amsterdam', '2026-03-25 18:00:00', '2026-03-26 07:00:00', 420, 'Round-trip', 'EcoWings', 690.00, 0),
('FL057', 'YYZCDG', 'Toronto', 'Paris CDG', '2026-03-22 19:00:00', '2026-03-23 09:00:00', 480, 'One-way', 'Air France', 720.00, 0),
('FL058', 'CDGYYZ', 'Paris CDG', 'Toronto', '2026-03-27 11:00:00', '2026-03-27 14:00:00', 540, 'Round-trip', 'Air France', 730.00, 0),
('FL059', 'FCOBER', 'Rome', 'Berlin', '2026-03-24 07:00:00', '2026-03-24 09:15:00', 135, 'One-way', 'Lufthansa', 110.00, 0),
('FL060', 'BERFCO', 'Berlin', 'Rome', '2026-03-29 10:00:00', '2026-03-29 12:15:00', 135, 'Round-trip', 'Lufthansa', 115.00, 0),
('FL061', 'MADLCY', 'Madrid', 'London City', '2026-03-26 06:00:00', '2026-03-26 08:30:00', 150, 'One-way', 'SkyHaven', 170.00, 0),
('FL062', 'LCYMAD', 'London City', 'Madrid', '2026-03-31 09:00:00', '2026-03-31 11:30:00', 150, 'Round-trip', 'SkyHaven', 175.00, 0),
('FL063', 'ICNSIN', 'Seoul Incheon', 'Singapore', '2026-04-01 09:00:00', '2026-04-01 14:30:00', 390, 'One-way', 'KoreanAir', 380.00, 0),
('FL064', 'SINICN', 'Singapore', 'Seoul Incheon', '2026-04-06 16:00:00', '2026-04-06 21:30:00', 390, 'Round-trip', 'KoreanAir', 385.00, 0),
('FL065', 'PEKLAX', 'Beijing', 'Los Angeles', '2026-04-03 13:00:00', '2026-04-03 10:00:00', 780, 'One-way', 'AirAsia', 700.00, 1),
('FL066', 'LAXPEK', 'Los Angeles', 'Beijing', '2026-04-08 13:00:00', '2026-04-09 17:00:00', 780, 'Round-trip', 'AirAsia', 710.00, 1),
('FL067', 'SFOHKG', 'San Francisco', 'Hong Kong', '2026-04-05 01:00:00', '2026-04-06 06:00:00', 900, 'One-way', 'DeltaAir', 820.00, 0),
('FL068', 'HKGSFO', 'Hong Kong', 'San Francisco', '2026-04-10 11:00:00', '2026-04-10 08:00:00', 900, 'Round-trip', 'DeltaAir', 830.00, 0),
('FL069', 'DXBHKG', 'Dubai', 'Hong Kong', '2026-04-07 10:00:00', '2026-04-07 21:00:00', 420, 'One-way', 'Emirates', 550.00, 0),
('FL070', 'HKGDXB', 'Hong Kong', 'Dubai', '2026-04-12 23:00:00', '2026-04-13 04:00:00', 420, 'Round-trip', 'Emirates', 555.00, 0),
('FL071', 'LCYFCO', 'London City', 'Rome', '2026-04-09 11:00:00', '2026-04-09 14:30:00', 150, 'One-way', 'SkyHaven', 190.00, 0),
('FL072', 'FCOLcY', 'Rome', 'London City', '2026-04-14 16:00:00', '2026-04-14 19:30:00', 150, 'Round-trip', 'SkyHaven', 195.00, 0),
('FL073', 'CDGSIN', 'Paris CDG', 'Singapore', '2026-04-11 23:00:00', '2026-04-12 18:00:00', 780, 'One-way', 'Air France', 850.00, 0),
('FL074', 'SINCDG', 'Singapore', 'Paris CDG', '2026-04-16 23:30:00', '2026-04-17 06:00:00', 750, 'Round-trip', 'Air France', 860.00, 0),
('FL075', 'JFKBER', 'John F Kennedy', 'Berlin', '2026-04-13 18:00:00', '2026-04-14 08:00:00', 480, 'One-way', 'Lufthansa', 700.00, 0),
('FL076', 'BERJFK', 'Berlin', 'John F Kennedy', '2026-04-18 10:00:00', '2026-04-18 13:00:00', 540, 'Round-trip', 'Lufthansa', 710.00, 0),
('FL077', 'LAXYVR', 'Los Angeles', 'Vancouver', '2026-04-15 08:00:00', '2026-04-15 10:45:00', 165, 'One-way', 'Air Canada', 200.00, 0),
('FL078', 'YVRLAX', 'Vancouver', 'Los Angeles', '2026-04-20 12:00:00', '2026-04-20 14:45:00', 165, 'Round-trip', 'Air Canada', 205.00, 0),
('FL079', 'SYDICN', 'Sydney', 'Seoul Incheon', '2026-04-17 10:00:00', '2026-04-17 19:00:00', 600, 'One-way', 'KoreanAir', 780.00, 0),
('FL080', 'ICNSYD', 'Seoul Incheon', 'Sydney', '2026-04-22 21:00:00', '2026-04-23 08:00:00', 600, 'Round-trip', 'KoreanAir', 790.00, 0),
('FL081', 'HKGBKK', 'Hong Kong', 'Bangkok', '2026-04-19 14:00:00', '2026-04-19 16:00:00', 180, 'One-way', 'AirAsia', 160.00, 0),
('FL082', 'BKKHKG', 'Bangkok', 'Hong Kong', '2026-04-24 17:00:00', '2026-04-24 19:00:00', 180, 'Round-trip', 'AirAsia', 165.00, 0),
('FL083', 'HNDPEK', 'Tokyo Haneda', 'Beijing', '2026-04-21 09:00:00', '2026-04-21 12:00:00', 180, 'One-way', 'JapanAir', 300.00, 0),
('FL084', 'PEKHND', 'Beijing', 'Tokyo Haneda', '2026-04-26 14:00:00', '2026-04-26 17:00:00', 180, 'Round-trip', 'JapanAir', 305.00, 0),
('FL085', 'AMSLCY', 'Amsterdam', 'London City', '2026-04-23 07:00:00', '2026-04-23 09:00:00', 60, 'One-way', 'EcoWings', 100.00, 0),
('FL086', 'LCYAMS', 'London City', 'Amsterdam', '2026-04-28 10:00:00', '2026-04-28 12:00:00', 60, 'Round-trip', 'EcoWings', 105.00, 0),
('FL087', 'YYZJFK', 'Toronto', 'John F Kennedy', '2026-04-25 08:00:00', '2026-04-25 09:30:00', 90, 'One-way', 'DeltaAir', 180.00, 0),
('FL088', 'JFKYYZ', 'John F Kennedy', 'Toronto', '2026-04-30 11:00:00', '2026-04-30 12:30:00', 90, 'Round-trip', 'DeltaAir', 185.00, 0),
('FL089', 'FCOMAD', 'Rome', 'Madrid', '2026-05-01 13:00:00', '2026-05-01 15:30:00', 150, 'One-way', 'EcoWings', 135.00, 0),
('FL090', 'MADFCO', 'Madrid', 'Rome', '2026-05-06 17:00:00', '2026-05-06 19:30:00', 150, 'Round-trip', 'EcoWings', 140.00, 0),
('FL091', 'ICNLAX', 'Seoul Incheon', 'Los Angeles', '2026-05-03 19:00:00', '2026-05-03 14:00:00', 660, 'One-way', 'KoreanAir', 880.00, 0),
('FL092', 'LAXICN', 'Los Angeles', 'Seoul Incheon', '2026-05-08 16:00:00', '2026-05-09 21:00:00', 660, 'Round-trip', 'KoreanAir', 890.00, 0),
('FL093', 'PEKDXB', 'Beijing', 'Dubai', '2026-05-05 02:00:00', '2026-05-05 06:00:00', 480, 'One-way', 'Emirates', 620.00, 0),
('FL094', 'DXBPEK', 'Dubai', 'Beijing', '2026-05-10 08:00:00', '2026-05-10 19:00:00', 420, 'Round-trip', 'Emirates', 630.00, 0),
('FL095', 'SFOYVR', 'San Francisco', 'Vancouver', '2026-05-07 09:00:00', '2026-05-07 11:30:00', 150, 'One-way', 'Air Canada', 190.00, 0),
('FL096', 'YVRSFO', 'Vancouver', 'San Francisco', '2026-05-12 13:00:00', '2026-05-12 15:30:00', 150, 'Round-trip', 'Air Canada', 195.00, 0),
('FL097', 'SINSVO', 'Singapore', 'Sheremetyevo', '2026-05-09 23:00:00', '2026-05-10 05:00:00', 600, 'One-way', 'SkyHaven', 700.00, 0),
('FL098', 'SVOJFK', 'Sheremetyevo', 'John F Kennedy', '2026-05-11 07:00:00', '2026-05-11 10:00:00', 600, 'One-way', 'DeltaAir', 710.00, 1),
('FL099', 'LAXSYD', 'Los Angeles', 'Sydney', '2026-05-13 22:00:00', '2026-05-14 06:00:00', 840, 'One-way', 'Qantas', 1100.00, 0),
('FL100', 'SYDLAX', 'Sydney', 'Los Angeles', '2026-05-18 10:00:00', '2026-05-18 06:00:00', 840, 'Round-trip', 'Qantas', 1110.00, 0),
('FL101', 'DXBLAX', 'Dubai', 'Los Angeles', '2026-05-15 08:00:00', '2026-05-15 13:00:00', 960, 'One-way', 'Emirates', 1250.00, 0),
('FL102', 'LAXDXB', 'Los Angeles', 'Dubai', '2026-05-20 16:00:00', '2026-05-21 19:00:00', 960, 'Round-trip', 'Emirates', 1260.00, 0),
('FL103', 'HNDSFO', 'Tokyo Haneda', 'San Francisco', '2026-05-17 18:00:00', '2026-05-17 11:00:00', 600, 'One-way', 'JapanAir', 780.00, 0),
('FL104', 'SFOHND', 'San Francisco', 'Tokyo Haneda', '2026-05-22 13:00:00', '2026-05-23 16:00:00', 600, 'Round-trip', 'JapanAir', 790.00, 0),
('FL105', 'CDGICN', 'Paris CDG', 'Seoul Incheon', '2026-05-19 14:00:00', '2026-05-20 08:00:00', 660, 'One-way', 'KoreanAir', 920.00, 0),
('FL106', 'ICNCDG', 'Seoul Incheon', 'Paris CDG', '2026-05-24 10:00:00', '2026-05-24 16:00:00', 720, 'Round-trip', 'KoreanAir', 930.00, 0),
('FL107', 'BERYYZ', 'Berlin', 'Toronto', '2026-05-21 10:00:00', '2026-05-21 13:00:00', 540, 'One-way', 'Lufthansa', 730.00, 0),
('FL108', 'YYZBER', 'Toronto', 'Berlin', '2026-05-26 18:00:00', '2026-05-27 08:00:00', 480, 'Round-trip', 'Lufthansa', 740.00, 0),
('FL109', 'FCOJFK', 'Rome', 'John F Kennedy', '2026-05-23 11:00:00', '2026-05-23 15:00:00', 600, 'One-way', 'DeltaAir', 770.00, 0),
('FL110', 'JFKFCO', 'John F Kennedy', 'Rome', '2026-05-28 17:00:00', '2026-05-29 07:00:00', 540, 'Round-trip', 'DeltaAir', 780.00, 0);

-- ===============================
-- 17️⃣ LIÊN KẾT HẠNG GHẾ CHO 100 CHUYẾN BAY MỚI
-- ===============================
INSERT INTO FlightCabinClass (cabinId, flightId)
VALUES
('C01', 'FL011'), ('C03', 'FL011'),
('C01', 'FL012'), ('C03', 'FL012'),
('C02', 'FL013'), ('C04', 'FL013'),
('C01', 'FL014'),
('C01', 'FL015'), ('C02', 'FL015'),
('C01', 'FL016'),
('C01', 'FL017'), ('C03', 'FL017'),
('C01', 'FL018'), ('C03', 'FL018'),
('C02', 'FL019'), ('C03', 'FL019'),
('C02', 'FL020'), ('C03', 'FL020'),
('C01', 'FL021'), ('C03', 'FL021'),
('C01', 'FL022'), ('C03', 'FL022'),
('C01', 'FL023'), ('C02', 'FL023'), ('C04', 'FL023'),
('C01', 'FL024'), ('C03', 'FL024'), ('C04', 'FL024'),
('C01', 'FL025'), ('C03', 'FL025'),
('C01', 'FL026'), ('C02', 'FL026'),
('C01', 'FL027'),
('C01', 'FL028'), ('C03', 'FL028'),
('C01', 'FL029'),
('C01', 'FL030'), ('C02', 'FL030'),
('C01', 'FL031'), ('C03', 'FL031'),
('C01', 'FL032'), ('C03', 'FL032'),
('C01', 'FL033'), ('C02', 'FL033'),
('C01', 'FL034'), ('C03', 'FL034'),
('C01', 'FL035'),
('C02', 'FL036'), ('C03', 'FL036'),
('C01', 'FL037'), ('C03', 'FL037'),
('C01', 'FL038'), ('C03', 'FL038'),
('C02', 'FL039'), ('C04', 'FL039'),
('C02', 'FL040'), ('C04', 'FL040'),
('C01', 'FL041'),
('C01', 'FL042'),
('C01', 'FL043'), ('C03', 'FL043'), ('C04', 'FL043'),
('C01', 'FL044'), ('C03', 'FL044'), ('C04', 'FL044'),
('C01', 'FL045'), ('C02', 'FL045'),
('C01', 'FL046'), ('C02', 'FL046'),
('C01', 'FL047'), ('C03', 'FL047'),
('C01', 'FL048'), ('C03', 'FL048'),
('C02', 'FL049'), ('C03', 'FL049'),
('C02', 'FL050'), ('C03', 'FL050'),
('C01', 'FL051'), ('C03', 'FL051'),
('C01', 'FL052'), ('C03', 'FL052'),
('C01', 'FL053'), ('C02', 'FL053'), ('C03', 'FL053'),
('C01', 'FL054'), ('C02', 'FL054'), ('C03', 'FL054'),
('C01', 'FL055'), ('C03', 'FL055'),
('C01', 'FL056'), ('C03', 'FL056'),
('C01', 'FL057'), ('C02', 'FL057'),
('C01', 'FL058'), ('C02', 'FL058'),
('C01', 'FL059'),
('C01', 'FL060'),
('C01', 'FL061'),
('C01', 'FL062'),
('C01', 'FL063'), ('C03', 'FL063'),
('C01', 'FL064'), ('C03', 'FL064'),
('C01', 'FL065'), ('C02', 'FL065'),
('C01', 'FL066'), ('C02', 'FL066'),
('C01', 'FL067'), ('C03', 'FL067'), ('C04', 'FL067'),
('C01', 'FL068'), ('C03', 'FL068'), ('C04', 'FL068'),
('C01', 'FL069'), ('C03', 'FL069'),
('C01', 'FL070'), ('C03', 'FL070'),
('C01', 'FL071'),
('C01', 'FL072'),
('C02', 'FL073'), ('C03', 'FL073'), ('C04', 'FL073'),
('C02', 'FL074'), ('C03', 'FL074'), ('C04', 'FL074'),
('C01', 'FL075'), ('C03', 'FL075'),
('C01', 'FL076'), ('C03', 'FL076'),
('C01', 'FL077'), ('C02', 'FL077'),
('C01', 'FL078'), ('C02', 'FL078'),
('C01', 'FL079'), ('C03', 'FL079'),
('C01', 'FL080'), ('C03', 'FL080'),
('C01', 'FL081'),
('C01', 'FL082'),
('C01', 'FL083'), ('C02', 'FL083'),
('C01', 'FL084'), ('C02', 'FL084'),
('C01', 'FL085'),
('C01', 'FL086'),
('C01', 'FL087'), ('C03', 'FL087'),
('C01', 'FL088'), ('C03', 'FL088'),
('C01', 'FL089'),
('C01', 'FL090'),
('C02', 'FL091'), ('C03', 'FL091'), ('C04', 'FL091'),
('C02', 'FL092'), ('C03', 'FL092'), ('C04', 'FL092'),
('C01', 'FL093'), ('C03', 'FL093'),
('C01', 'FL094'), ('C03', 'FL094'),
('C01', 'FL095'), ('C02', 'FL095'),
('C01', 'FL096'), ('C02', 'FL096'),
('C01', 'FL097'), ('C03', 'FL097'),
('C01', 'FL098'), ('C03', 'FL098'),
('C01', 'FL099'), ('C02', 'FL099'), ('C03', 'FL099'),
('C01', 'FL100'), ('C02', 'FL100'), ('C03', 'FL100'),
('C01', 'FL101'), ('C03', 'FL101'), ('C04', 'FL101'),
('C01', 'FL102'), ('C03', 'FL102'), ('C04', 'FL102'),
('C01', 'FL103'), ('C02', 'FL103'),
('C01', 'FL104'), ('C02', 'FL104'),
('C02', 'FL105'), ('C03', 'FL105'),
('C02', 'FL106'), ('C03', 'FL106'),
('C01', 'FL107'), ('C02', 'FL107'),
('C01', 'FL108'), ('C02', 'FL108'),
('C01', 'FL109'), ('C03', 'FL109'),
('C01', 'FL110'), ('C03', 'FL110');

-- ===============================
-- 18️⃣ THÊM SEATMAP CHO 100 CHUYẾN BAY MỚI
-- ===============================

-- Tạo một Sơ đồ ghế JSON mẫu
SET @seatMapEco = '[
{"seatNumber": "10A", "isAvailable": true}, {"seatNumber": "10B", "isAvailable": true}, {"seatNumber": "10C", "isAvailable": true}, {"seatNumber": "10D", "isAvailable": true}, {"seatNumber": "10E", "isAvailable": true}, {"seatNumber": "10F", "isAvailable": true},
{"seatNumber": "11A", "isAvailable": true}, {"seatNumber": "11B", "isAvailable": false}, {"seatNumber": "11C", "isAvailable": true}, {"seatNumber": "11D", "isAvailable": true}, {"seatNumber": "11E", "isAvailable": true}, {"seatNumber": "11F", "isAvailable": true},
{"seatNumber": "12A", "isAvailable": true}, {"seatNumber": "12B", "isAvailable": true}, {"seatNumber": "12C", "isAvailable": true}, {"seatNumber": "12D", "isAvailable": false}, {"seatNumber": "12E", "isAvailable": true}, {"seatNumber": "12F", "isAvailable": true}
]';

SET @seatMapPrem = '[
{"seatNumber": "05A", "isAvailable": true}, {"seatNumber": "05C", "isAvailable": true}, {"seatNumber": "05D", "isAvailable": true}, {"seatNumber": "05F", "isAvailable": true}, {"seatNumber": "05G", "isAvailable": true},
{"seatNumber": "06A", "isAvailable": true}, {"seatNumber": "06C", "isAvailable": false}, {"seatNumber": "06D", "isAvailable": true}, {"seatNumber": "06F", "isAvailable": true}, {"seatNumber": "06G", "isAvailable": true}
]';

SET @seatMapBiz = '[
{"seatNumber": "01A", "isAvailable": true}, {"seatNumber": "01D", "isAvailable": true}, {"seatNumber": "01G", "isAvailable": true},
{"seatNumber": "02A", "isAvailable": true}, {"seatNumber": "02D", "isAvailable": false}, {"seatNumber": "02G", "isAvailable": true}
]';

SET @seatMapFirst = '[
{"seatNumber": "01A", "isAvailable": true}, {"seatNumber": "01K", "isAvailable": false},
{"seatNumber": "02A", "isAvailable": true}, {"seatNumber": "02K", "isAvailable": true}
]';

-- Cập nhật tất cả các hạng ghế mới
UPDATE FlightCabinClass SET seatMap = @seatMapEco WHERE flightId BETWEEN 'FL011' AND 'FL110' AND cabinId = 'C01';
UPDATE FlightCabinClass SET seatMap = @seatMapPrem WHERE flightId BETWEEN 'FL011' AND 'FL110' AND cabinId = 'C02';
UPDATE FlightCabinClass SET seatMap = @seatMapBiz WHERE flightId BETWEEN 'FL011' AND 'FL110' AND cabinId = 'C03';
UPDATE FlightCabinClass SET seatMap = @seatMapFirst WHERE flightId BETWEEN 'FL011' AND 'FL110' AND cabinId = 'C04';


INSERT INTO FlightCabinClass (cabinId, flightId)
VALUES ('C01', 'FL007'); 
-- Chạy lệnh này sau khi đã INSERT các dòng cũ (FL007 có C02 và C03)

-- BƯỚC 2: Gán sơ đồ ghế mẫu (JSON) cho FL007 - C01
-- (Dùng @seatMapEco đã được định nghĩa ở trên)
UPDATE FlightCabinClass
SET seatMap = @seatMapEco 
WHERE flightId = 'FL007' AND cabinId = 'C01';-- Chạy lệnh này sau khi đã INSERT các dòng cũ (FL007 có C02 và C03)

-- BƯỚC 2: Gán sơ đồ ghế mẫu (JSON) cho FL007 - C01
-- (Dùng @seatMapEco đã được định nghĩa ở trên)
UPDATE FlightCabinClass
SET seatMap = '[
  {"seatNumber": "01A", "isAvailable": true}, {"seatNumber": "01K", "isAvailable": true},
  {"seatNumber": "02A", "isAvailable": true}, {"seatNumber": "02K", "isAvailable": true},
  {"seatNumber": "03A", "isAvailable": true}, {"seatNumber": "03K", "isAvailable": false},
  {"seatNumber": "04A", "isAvailable": true}, {"seatNumber": "04C", "isAvailable": false}
]'
WHERE flightId = 'FL007' AND cabinId = 'C01';


ALTER TABLE Baggage MODIFY weight VARCHAR(50);

SHOW COLUMNS FROM Baggage LIKE 'weight';
