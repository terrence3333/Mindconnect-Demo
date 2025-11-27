import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    location: '',
    supportTypes: [],
    urgencyLevel: 'moderate',
    newsletter: false,
    privacy: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'supportTypes') {
      const newSupportTypes = checked
        ? [...formData.supportTypes, value]
        : formData.supportTypes.filter(type => type !== value);
      
      setFormData({
        ...formData,
        supportTypes: newSupportTypes
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.privacy) {
      setError('Please accept the privacy policy to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      toast.success('Registration successful! Welcome to MindConnect 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg fade-in">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Join MindConnect 💚
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Start your mental health journey with us
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="+260 XXX XXX XXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age Range *</label>
              <select
                name="age"
                required
                value={formData.age}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="">Select age range</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-55">46-55</option>
                <option value="56-65">56-65</option>
                <option value="65+">65+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What type of support are you looking for?
            </label>
            <div className="space-y-2">
              {[
                { value: 'peer', label: 'Peer Support Groups' },
                { value: 'counseling', label: 'Professional Counseling' },
                { value: 'healthcare', label: 'Healthcare Providers' },
                { value: 'community', label: 'Community/Faith-based Support' },
                { value: 'ngo', label: 'NGO Resources' }
              ].map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    name="supportTypes"
                    value={option.value}
                    checked={formData.supportTypes.includes(option.value)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Support Urgency</label>
            <select
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value="low">Looking for preventive support</option>
              <option value="moderate">Experiencing some challenges</option>
              <option value="high">Need support soon</option>
              <option value="urgent">Need immediate help</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="privacy"
                checked={formData.privacy}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <span className="text-sm text-gray-700">
                I agree to the privacy policy and terms of service *
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                I would like to receive mental health resources via email
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
