import { useTheme } from '../contexts/ThemeContext';

export default function AboutUs() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            We are dedicated to making a difference in our community by connecting food donors with those in need.
            Our mission is to reduce food waste and help feed families who are experiencing food insecurity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              To create a sustainable food donation network that helps reduce food waste and provides
              nutritious meals to those in need within our community.
            </p>
          </div>

          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p>
              A world where no one goes hungry, and food resources are shared efficiently and sustainably
              to benefit everyone in our community.
            </p>
          </div>

          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="list-disc list-inside">
              <li>Community First</li>
              <li>Sustainability</li>
              <li>Transparency</li>
              <li>Efficiency</li>
              <li>Compassion</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div>Meals Donated</div>
            </div>
            <div className={`p-6 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div>Families Helped</div>
            </div>
            <div className={`p-6 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div>Active Donors</div>
            </div>
            <div className={`p-6 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div>Partner Organizations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 