// src/controllers/airportController.ts
import { Request, Response } from "express";
import { Flight } from "../models/Flight"; // giữ như bạn có
// (nếu Flight export default khác, adjust import)

type AirportDTO = {
  name: string;
  city: string;
  code: string;
  country?: string;
};

const detectIATACodeFromName = (name: string): string | null => {
  // tìm token 3 chữ hoa (ví dụ "Paris CDG")
  const tokens = name.split(/\s+/);
  for (const t of tokens) {
    if (/^[A-Z]{3}$/.test(t)) return t;
  }
  return null;
};

const generateAirportCode = (name: string): string => {
  // lấy chữ cái đầu mỗi token
  const tokens = name.split(/\s+/).filter(Boolean);
  let code = tokens.map(t => t[0].toUpperCase()).join("");
  // nếu có một token là như "New" "York" -> NY -> pad thành NYX
  if (code.length >= 3) return code.slice(0, 3);
  return code.padEnd(3, "X");
};

const extractCityFromName = (name: string): string => {
  // simple heuristic: lấy phần trước token IATA hoặc lấy phần trước dấu comma
  const iata = detectIATACodeFromName(name);
  if (iata) {
    return name.replace(iata, "").trim();
  }
  if (name.includes(",")) {
    return name.split(",")[0].trim();
  }
  // nếu "London City" -> city = "London"
  const tokens = name.split(/\s+/);
  return tokens[0];
};

export const getAllAirports = async (req: Request, res: Response) => {
  try {
    // lấy tất cả flight
    const flights = await Flight.findAll({
      attributes: ["departureAirport", "arrivalAirport"],
      raw: true,
    });

    const airportSet = new Set<string>();
    flights.forEach((f: any) => {
      if (f.departureAirport) airportSet.add(f.departureAirport);
      if (f.arrivalAirport) airportSet.add(f.arrivalAirport);
    });

    const airports: AirportDTO[] = Array.from(airportSet).map((name) => {
      const iata = detectIATACodeFromName(name);
      const code = iata ?? generateAirportCode(name);
      const city = extractCityFromName(name);
      const country = "Unknown"; // bạn có thể mapping sau
      return { name, city, code, country };
    });

    // (tuỳ chọn) sắp xếp theo city/name
    airports.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sân bay thành công",
      data: airports,
    });
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy danh sách sân bay:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
