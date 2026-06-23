export type UserRole = "customer" | "owner" | "admin";

export type PrivacyLevel = "open" | "semi-private" | "fully-private";

export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOpeningHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface IAmenities {
  parking: boolean;
  wifi: boolean;
  ac: boolean;
  familyRooms: boolean;
  coupleSeating: boolean;
}

export interface IRestaurant {
  _id: string;
  ownerId: string | IUser;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  openingHours: IOpeningHours[];
  amenities: IAmenities;
  photos: string[];
  verified: VerificationStatus;
  averageRating: number;
  totalReviews: number;
  viewCount: number;
  priceRange: 1 | 2 | 3 | 4;
  createdAt: string;
  updatedAt: string;
}

export interface ICabin {
  _id: string;
  restaurantId: string | IRestaurant;
  name: string;
  description: string;
  privacyType: PrivacyLevel;
  capacity: number;
  photos: string[];
  active: boolean;
}

export interface IBooking {
  _id: string;
  userId: string | IUser;
  restaurantId: string | IRestaurant;
  cabinId?: string | ICabin;
  bookingDate: string;
  bookingTime: string;
  peopleCount: number;
  status: BookingStatus;
  notes?: string;
  ownerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  userId: string | IUser;
  restaurantId: string | IRestaurant;
  bookingId: string | IBooking;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: string;
}

export interface IFavorite {
  _id: string;
  userId: string;
  restaurantId: string | IRestaurant;
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RestaurantFilters {
  city?: string;
  search?: string;
  parking?: boolean;
  wifi?: boolean;
  ac?: boolean;
  familyRooms?: boolean;
  coupleSeating?: boolean;
  priceRange?: string;
  sort?: "rating" | "popular" | "newest";
  page?: number;
  limit?: number;
}
