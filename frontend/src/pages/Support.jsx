import React, { useState, useEffect } from 'react';
import { supportService } from '../services/supportService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

const Support = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await supportService.getAllGroups();
      if (response.success) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load support groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await supportService.joinGroup(groupId);
      toast.success('Successfully joined the group!');
      fetchGroups();
    } catch (error) {
      toast.error(error.message || 'Failed to join group');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Support Groups</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group._id} title={group.name}>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Type:</strong> {group.type}</p>
              <p><strong>Format:</strong> {group.format}</p>
              <p><strong>Members:</strong> {group.members.length}/{group.maxMembers}</p>
            </div>
            <Button
              onClick={() => handleJoinGroup(group._id)}
              variant="primary"
              className="w-full"
            >
              Join Group
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Support;
