import React, { useState } from 'react';
import { Store, UtensilsCrossed, Clock, Calendar, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface FormData {
  businessType: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  pickupTime: string;
  frequency: string;
}

function BusinessDonate() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    pickupTime: '',
    frequency: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.businessType) newErrors.businessType = 'Please select a business type';
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.contactName) newErrors.contactName = 'Contact name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    if (!formData.frequency) newErrors.frequency = 'Frequency is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

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
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (!user || !token) {
      console.log('Auth state:', { user, token });
      toast.error('Please login to submit a business donation');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting with token:', token);
      const response = await fetch('http://localhost:5000/api/restaurants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        })
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register business');
      }

      toast.success('Business registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Business registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register business');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center">Partner With FoodShare</h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform transition-all duration-300 hover:shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, businessType: 'restaurant' }))}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                    formData.businessType === 'restaurant'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <UtensilsCrossed className="h-8 w-8 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Restaurant</h3>
                  <p className="text-gray-600">Donate prepared food and surplus ingredients</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, businessType: 'store' }))}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                    formData.businessType === 'store'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Store className="h-8 w-8 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Grocery Store</h3>
                  <p className="text-gray-600">Donate groceries and perishable items</p>
                </button>
              </div>

              {errors.businessType && (
                <p className="text-red-500 text-sm">{errors.businessType}</p>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="business-name">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="business-name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                        errors.businessName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your business name"
                    />
                  </div>
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact-name">
                    Contact Person
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="contact-name"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                        errors.contactName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact person's name"
                    />
                  </div>
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Business Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your business email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter business phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Business Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your business address"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Preferred Pickup Schedule
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-green-500" />
                      <select
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                          errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select time</option>
                        <option value="morning">Morning (8AM - 11AM)</option>
                        <option value="afternoon">Afternoon (12PM - 4PM)</option>
                        <option value="evening">Evening (5PM - 8PM)</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                          errors.frequency ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="custom">Custom Schedule</option>
                      </select>
                    </div>
                  </div>
                  {(errors.pickupTime || errors.frequency) && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pickupTime || errors.frequency}
                    </p>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-green-600 text-white py-4 px-6 rounded-md text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Partnership Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDonate;