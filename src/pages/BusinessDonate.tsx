import React, { useState } from 'react';
import { Store, UtensilsCrossed, Clock, Calendar } from 'lucide-react';

function BusinessDonate() {
  const [businessType, setBusinessType] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8">Partner With FoodShare</h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => setBusinessType('restaurant')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    businessType === 'restaurant'
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
                  onClick={() => setBusinessType('store')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    businessType === 'store'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Store className="h-8 w-8 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Grocery Store</h3>
                  <p className="text-gray-600">Donate groceries and perishable items</p>
                </button>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="business-name">
                  Business Name
                </label>
                <input
                  type="text"
                  id="business-name"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact-name">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contact-name"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter contact person's name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Business Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your business email"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter business phone number"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Business Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your business address"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Preferred Pickup Times
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    <select className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select time</option>
                      <option value="morning">Morning (8AM - 11AM)</option>
                      <option value="afternoon">Afternoon (12PM - 4PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <select className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="w-full btn-primary flex items-center justify-center">
                <Store className="mr-2 h-5 w-5" />
                Submit Partnership Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDonate;