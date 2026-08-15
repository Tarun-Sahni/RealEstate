import connectDB from "@/lib/database";
import { getAuthUser } from "@/lib/dal";
import { Favorite, Property } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized."
      }, { status: 401 })
    }

    const favorites = await Favorite.find({ user: user._id }).select("property").lean();

    return NextResponse.json({
      success: true,
      message: "Favorites fetched successfully.",
      propertyIds: favorites.map((favorite) => favorite.property.toString())
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error."
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({
        success: false,
        message: "Missing Required Fields."
      }, { status: 400 })
    }

    await connectDB();
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Please login to add properties to your wishlist."
      }, { status: 401 })
    }

    const property = await Property.findById(propertyId).select("_id");
    if (!property) {
      return NextResponse.json({
        success: false,
        message: "Property not found."
      }, { status: 404 })
    }

    const existing = await Favorite.findOne({ user: user._id, property: propertyId });
    if (existing) {
      await existing.deleteOne();
      return NextResponse.json({
        success: true,
        message: "Removed from wishlist.",
        isFavorited: false
      }, { status: 200 })
    }

    await Favorite.create({ user: user._id, property: propertyId });
    return NextResponse.json({
      success: true,
      message: "Added to wishlist.",
      isFavorited: true
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error."
    }, { status: 500 })
  }
}
