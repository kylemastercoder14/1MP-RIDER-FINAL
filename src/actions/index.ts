/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { cookies } from "next/headers";
import * as jose from "jose";

export const signIn = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    // Find rider by email
    const rider = await db.rider.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!rider) {
      return { error: "No account found with this email." };
    }

    if (!rider.isEmailVerified) {
      return { error: "Please verify your email first." };
    }

    if (rider.password !== password) {
      return { error: "Incorrect password." };
    }

    // Create JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";
    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(rider.id.toString())
      .sign(secret);

    // Set cookie
    (await cookies()).set("1MP-Authorization", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 3, // 3 days
      sameSite: "strict",
      path: "/",
    });

    return { success: "Logged in successfully.", rider };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

export const sendOtp = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      return { error: "Email address and password are required" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "Invalid email format." };
    }

    const existingRider = await db.rider.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingRider && existingRider.isEmailVerified) {
      return { error: "Rider with this email already exists" };
    }

    // Generate OTP (6 digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP in database
    const rider = await db.rider.upsert({
      where: { email },
      update: { otpCode, otpExpiresAt },
      create: { email, password, otpCode, otpExpiresAt },
    });

    // Send OTP via Nodemailer
    const response = await sendOtpEmail(email, otpCode);

    if (response.message) {
      return { error: "Failed to send OTP email." };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(rider.id.toString())
      .sign(secret);

    (
      await // Set the cookie with the JWT
      cookies()
    ).set("1MP-Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    return { success: "OTP sent successfully. Please check your email." };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

export const verifyOtp = async (otp: string) => {
  try {
    if (!otp) {
      return { error: "OTP code is required" };
    }

    if (!/^\d{6}$/.test(otp)) {
      return { error: "Invalid OTP format. Must be 6 digits." };
    }

    const existingRider = await db.rider.findFirst({
      where: {
        otpCode: otp,
        otpExpiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!existingRider) {
      return { error: "Invalid or expired OTP." };
    }

    const rider = await db.rider.update({
      where: { id: existingRider.id },
      data: {
        isEmailVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    if (!rider) {
      return { error: "Failed to verify OTP. Please try again." };
    }

    return {
      success: "OTP verified successfully. Your email is now verified.",
    };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

export const onboardRider = async (formData: any, riderId: string) => {
  try {
    if (!riderId) {
      return { error: "Unauthorized. Please sign in again." };
    }

    const docs = formData.documents || {};

    const updatedRider = await db.rider.update({
      where: { id: riderId },
      data: {
        name: formData.name,
        vehicleType: formData.vehicleType,
        gender: formData.gender,
        dateOfBirth: formData.dob,
        phoneNumber: formData.phone,
        licenseNumber: formData.licenseNo,
        plateNumber: formData.plateNo,
        vehicleOwnerShip: formData.vehicleOwnership,
        licenseIdImg: docs.license?.url || null,
        certRegImg: docs.cr?.url || null,
        officialReceiptImg: docs.or?.url || null,
        vehicleBackImg: docs.vehicle_back?.url || null,
        profileImg: docs.profile?.url || null,
        adminApproval: "Under Review",
      },
    });

    if (!updatedRider) {
      return { error: "Failed to update onboarding data." };
    }

    return {
      success: "Onboarding completed successfully!",
      rider: updatedRider,
    };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

export const signOut = async () => {
  (await cookies()).set("1MP-Authorization", "", { maxAge: 0, path: "/" });
};

export async function getOrders(vehicleType: string) {
  const orderItems = await db.order.findMany({
    where: {
      status: "Pending",
      vehicleType,
      riderId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orderItem: {
        include: {
          product: true,
          vendor: {
            include: {
              vendorAddress: {
                where: {
                  type: "Pickup",
                  status: "Open",
                },
              },
            },
          },
        },
      },
      address: true,
    },
  });

  return orderItems;
}

export async function acceptOrder(orderId: string, riderId: string) {
  try {
    // Check if order is already accepted by someone else
    const existing = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!existing) {
      return { success: false, message: "Order not found" };
    }

    if (existing.riderId) {
      return {
        success: false,
        message: "Order already taken by another rider.",
      };
    }

    // Mark as accepted
    await db.order.update({
      where: { id: orderId },
      data: {
        riderId,
        status: "Driver Assigned",
        orderItem: {
          updateMany: {
            where: {
              orderId,
            },
            data: {
              status: "Accepted",
            },
          },
        },
      },
    });

    return { success: true, message: "Order accepted" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Something went wrong." };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  riderId?: string
) {
  try {
    // 🕒 Dynamically map status to corresponding timestamp field
    const statusTimestamps: Record<
      string,
      keyof import("@prisma/client").Order
    > = {
      Processing: "processingAt",
      Shipped: "shippedAt",
      "Out For Delivery": "outForDeliveryAt",
      Delivered: "deliveredAt",
      Cancelled: "cancelledAt",
    };

    // Build dynamic update data
    const updateData: any = {
      status,
      riderId,
      updatedAt: new Date(),
    };

    // Add timestamp only if status has a corresponding field
    if (statusTimestamps[status]) {
      updateData[statusTimestamps[status]] = new Date();
    }

    // 🧹 Clear other timestamp fields if necessary
    for (const key of Object.values(statusTimestamps)) {
      if (key !== statusTimestamps[status]) {
        updateData[key] = null;
      }
    }

    // 🛠 Update order and related order items
    await db.order.update({
      where: { id: orderId },
      data: {
        ...updateData,
        orderItem: {
          updateMany: {
            where: { orderId },
            data: { status }, // sync item status with main order
          },
        },
      },
    });

    // 📢 Optional: Send notification to customer here

    return {
      success: true,
      message: `Order status updated to ${status}`,
    };
  } catch (error) {
    console.error("❌ updateOrderStatus error:", error);
    return { success: false, message: "Failed to update order status" };
  }
}

export async function toggleOnDuty(riderId: string) {
  // Fetch current onDuty status
  const rider = await db.rider.findUnique({
    where: { id: riderId },
    select: { onDuty: true },
  });

  if (!rider) throw new Error("Rider not found");

  // Toggle onDuty
  const updatedRider = await db.rider.update({
    where: { id: riderId },
    data: { onDuty: !rider.onDuty },
  });

  return updatedRider;
}
