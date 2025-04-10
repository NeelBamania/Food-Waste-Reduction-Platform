import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { createDonation } from '../services/firebase';
import toast from 'react-hot-toast';
import { Store, Utensils, Package, Calendar, MapPin, Clock, MessageSquare, Building2 } from 'lucide-react';

const Donate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    donorType: '',
    organizationName: '',
    foodType: '',
    quantity: '',
    unit: 'items', // Default unit
    expiryDate: '',
    description: '',
    pickupAddress: '',
    pickupTime: '',
    specialInstructions: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.donorType) newErrors.donorType = 'Please select donor type';
    if (!formData.foodType) newErrors.foodType = 'Please select food type';
    if (!formData.quantity) newErrors.quantity = 'Please enter quantity';
    if (!formData.expiryDate) newErrors.expiryDate = 'Please select expiry date';
    if (!formData.description) newErrors.description = 'Please enter description';
    if (!formData.pickupAddress) newErrors.pickupAddress = 'Please enter pickup address';
    if (!formData.pickupTime) newErrors.pickupTime = 'Please select pickup time';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (!user) {
      toast.error('Please login to submit a donation');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const donationData = {
        donor: user.id,
        donorName: user.name || 'Anonymous',
        donorType: formData.donorType,
        organizationName: formData.organizationName,
        foodType: formData.foodType,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        expiryTime: new Date(formData.expiryDate).toISOString(),
        description: formData.description,
        pickupAddress: formData.pickupAddress,
        pickupTime: new Date(formData.pickupTime).toISOString(),
        specialInstructions: formData.specialInstructions,
        status: 'pending',
        adminApproval: false
      };

      await createDonation(donationData);
      toast.success('Donation submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Donation submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Donate Food</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Donor Type</label>
              <select
                name="donorType"
                value={formData.donorType}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  errors.donorType ? 'border-red-500' : 'border-gray-300'
                } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <option value="">Select donor type</option>
                <option value="individual">Individual</option>
                <option value="restaurant">Restaurant</option>
                <option value="store">Store</option>
              </select>
              {errors.donorType && <p className="text-red-500 text-sm mt-1">{errors.donorType}</p>}
            </div>

            {formData.donorType !== 'individual' && (
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${
                    errors.organizationName ? 'border-red-500' : 'border-gray-300'
                  } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                />
                {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Food Type</label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  errors.foodType ? 'border-red-500' : 'border-gray-300'
                } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <option value="">Select food type</option>
                <option value="prepared">Prepared Food</option>
                <option value="raw">Raw Ingredients</option>
                <option value="packaged">Packaged Food</option>
                <option value="other">Other</option>
              </select>
              {errors.foodType && <p className="text-red-500 text-sm mt-1">{errors.foodType}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className={`w-full p-2 rounded-md border ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border border-gray-300 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <option value="items">Items</option>
                  <option value="kg">Kilograms</option>
                  <option value="g">Grams</option>
                  <option value="l">Liters</option>
                  <option value="ml">Milliliters</option>
                  <option value="boxes">Boxes</option>
                  <option value="packages">Packages</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date</label>
              <input
                type="datetime-local"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full p-2 rounded-md border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pickup Address</label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  errors.pickupAddress ? 'border-red-500' : 'border-gray-300'
                } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              />
              {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pickup Time</label>
              <input
                type="datetime-local"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              />
              {errors.pickupTime && <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Special Instructions</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows={2}
                className={`w-full p-2 rounded-md border ${
                  errors.specialInstructions ? 'border-red-500' : 'border-gray-300'
                } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              />
              {errors.specialInstructions && <p className="text-red-500 text-sm mt-1">{errors.specialInstructions}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Donation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;