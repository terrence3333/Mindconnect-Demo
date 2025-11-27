import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', location: '' });

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources', { params: filters });
      if (response.data.success) {
        setResources(response.data.data.resources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Mental Health Resources</h1>
      <p className="text-gray-600 mb-8">Find professional support in your area</p>

      {/* Crisis Support */}
      <Alert
        type="warning"
        message="If you're in crisis, call 988 (Suicide & Crisis Lifeline) or 911 for immediate help"
      />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="input-field"
        >
          <option value="">All Types</option>
          <option value="counseling">Counseling</option>
          <option value="healthcare">Healthcare</option>
          <option value="ngo">NGO</option>
          <option value="crisis">Crisis Support</option>
        </select>

        <input
          type="text"
          placeholder="Filter by location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="input-field"
        />
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource._id} title={resource.name}>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <div className="space-y-2 text-sm">
              {resource.contact?.phone && (
                <p><strong>Phone:</strong> {resource.contact.phone}</p>
              )}
              {resource.contact?.email && (
                <p><strong>Email:</strong> {resource.contact.email}</p>
              )}
              {resource.location?.city && (
                <p><strong>Location:</strong> {resource.location.city}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Resources;
