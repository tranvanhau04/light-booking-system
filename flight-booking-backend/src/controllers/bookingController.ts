import { Response } from 'express';
import { sequelize } from '../config/database'; 
import { Transaction } from 'sequelize';
import { IAuthRequest } from '../middleware/auth';

// Import tất cả các model bạn sẽ dùng
import { Flight } from '../models/Flight';
import { FlightCabinClass } from '../models/FlightCabinClass';
import { Booking } from '../models/Booking';
import { Passenger } from '../models/Passenger';
import { BookingPassenger } from '../models/BookingPassenger';
import { SeatSelection } from '../models/SeatSelection';
import { Baggage } from '../models/Baggage';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { FlightBooking } from '../models/FlightBooking';

// Định nghĩa kiểu dữ liệu cho một ghế trong seatMap
interface SeatMapItem {
  seatNumber: string;
  isAvailable: boolean;
}

// === HÀM TẠO ID NGẪU NHIÊN ===
// (Tạo 8 số ngẫu nhiên)
const generateId = (prefix: string): string => {
  const num = Math.floor(10000000 + Math.random() * 90000000); // 8 chữ số
  return `${prefix}${num}`.substring(0, 10); // Đảm bảo luôn dài 10 ký tự
};
// =============================

export const createBooking = async (req: IAuthRequest, res: Response) => {
  const t: Transaction = await sequelize.transaction();

  try {
    const { flightId, passengers, selectedSeats, baggage, paymentToken } = req.body;
    const userId = req.user?.userId; 

    if (!userId) {
      throw new Error('Người dùng không được xác thực');
    }

    // 2. LẤY THÔNG TIN CHUYẾN BAY VÀ KIỂM TRA GHẾ
    const flight = await Flight.findByPk(flightId, {
      include: [
        {
          model: FlightCabinClass,
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE, // Khóa ở cấp cao nhất
    });

    if (!flight || !flight.flightCabinClasses) {
      throw new Error('Không tìm thấy chuyến bay');
    }

    let calculatedPrice = flight.basePrice || 0;
    const cabinClassesToUpdate: FlightCabinClass[] = [];

    // Kiểm tra tính khả dụng của tất cả các ghế
    for (const seat of selectedSeats) {
      const { seatNumber, cabinId } = seat;
      const cabin = flight.flightCabinClasses.find(c => c.cabinId === cabinId);

      if (!cabin || !cabin.seatMap) {
        throw new Error(`Hạng vé ${cabinId} hoặc bản đồ ghế không tồn tại`);
      }

      const seatMap = cabin.seatMap as SeatMapItem[];
      const seatInfo = seatMap.find(s => s.seatNumber === seatNumber);

      if (!seatInfo) {
        throw new Error(`Ghế ${seatNumber} không tồn tại trong bản đồ`);
      }
      
      if (!seatInfo.isAvailable) {
        throw new Error(`Ghế ${seatNumber} không còn trống`);
      }

      seatInfo.isAvailable = false;
      (cabin as any).changed('seatMap', true); 
      
      if (!cabinClassesToUpdate.find(c => c.cabinId === cabin.cabinId)) {
        cabinClassesToUpdate.push(cabin);
      }
    }
    
    if (baggage && baggage.price) {
        calculatedPrice += baggage.price;
    }

    // 3. XỬ LÝ THANH TOÁN (GIẢ LẬP)
    console.log(`Giả lập thanh toán thành công với giá: ${calculatedPrice}`);

    // 4. TẠO CÁC RECORD TRONG DATABASE (TRONG TRANSACTION)

    // a. Tạo Booking chính
    const newBooking = await Booking.create({
      bookingId: generateId('BK'), // <-- SỬA LỖI Ở ĐÂY
      bookingDate: new Date(),
      totalPrice: calculatedPrice,
      status: 'Success',
      userId: userId,
    }, { transaction: t });

    // b. Tạo Payment
    await Payment.create({
      paymentId: generateId('PM'), // <-- THÊM ID
      amount: calculatedPrice,
      status: 'Completed',
      transactionTime: new Date(),
      bankTransactionId: `TXN${Date.now().toString().slice(-8)}`, // ID giả lập
      bookingId: newBooking.bookingId,
    }, { transaction: t });

    // c. Tạo Baggage (nếu có)
    if (baggage) {
      await Baggage.create({
        baggageId: generateId('BG'), // <-- THÊM ID
        weight: baggage.weight,
        price: baggage.price,
        type: baggage.type,
        bookingId: newBooking.bookingId,
      }, { transaction: t });
    }

    // d. Liên kết Chuyến bay với Booking
    await FlightBooking.create({
        flightId: flight.flightId,
        bookingId: newBooking.bookingId
    }, { transaction: t });

    // e. Tạo Hành khách và Ghế
    for (const seat of selectedSeats) {
      const passengerInfo = passengers[seat.passengerIndex];
      
      // e1. Tạo Passenger
      const newPassenger = await Passenger.create({
        passengerId: generateId('PS'), // <-- THÊM ID
        fullName: passengerInfo.fullName,
        gender: passengerInfo.gender,
        dateOfBirth: passengerInfo.dateOfBirth,
        nationality: passengerInfo.nationality,
        idNumber: passengerInfo.idNumber,
      }, { transaction: t });

      // e2. Link Passenger với Booking
      await BookingPassenger.create({
        bookingId: newBooking.bookingId,
        passengerId: newPassenger.passengerId,
      }, { transaction: t });

      // e3. Tạo SeatSelection
      await SeatSelection.create({
        seatId: generateId('ST'), // <-- THÊM ID
        seatNumber: seat.seatNumber,
        status: 'Selected',
        cabinId: seat.cabinId,
        bookingId: newBooking.bookingId,
        flightId: flight.flightId, 
      }, { transaction: t });
    }

    // 5. LƯU CÁC THAY ĐỔI VỀ SEATMAP
    await Promise.all(
      cabinClassesToUpdate.map(cabin => cabin.save({ transaction: t }))
    );

    // 6. COMMIT TRANSACTION
    await t.commit();

    // 7. TRẢ VỀ THÀNH CÔNG
    res.status(201).json(newBooking);

  } catch (err: any) {
    // 8. ROLLBACK NẾU CÓ LỖI
    await t.rollback();
    console.error('Lỗi khi tạo booking:', err.message);
    res.status(400).json({ msg: 'Tạo booking thất bại', error: err.message });
  }
};