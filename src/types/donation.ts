export interface Donation {
  id: string;
  donor: string;
  donorName?: string;
  charity?: string;
  volunteer?: string;
  foodType: string;
  quantity: number;
  unit: string;
  description: string;
  pickupAddress: string;
  charityAddress?: string;
  pickupTime: string;
  expiryTime: string;
  status: 'pending' | 'approved' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  adminApproval: boolean;
  adminNotes?: string;
  images?: string[];
  trackingHistory?: {
    status: string;
    timestamp: string;
    notes?: string;
  }[];
  rating?: number;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
} 