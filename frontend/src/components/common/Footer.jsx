import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-green-400">About MindConnect</h4>
            <p className="text-gray-300 text-sm">
              Supporting mental health and well-being through community, resources, and care.
              Contributing to UN SDG 3.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-400">Home</Link></li>
              <li><Link to="/resources" className="hover:text-green-400">Resources</Link></li>
              <li><Link to="/support" className="hover:text-green-400">Support Groups</Link></li>
              <li><Link to="/about" className="hover:text-green-400">About Us</Link></li>
            </ul>
          </div>

          {/* Crisis Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-green-400">Crisis Support</h4>
            <ul className="space-y-2 text-sm">
              <li>Emergency: <a href="tel:911" className="hover:text-green-400">911</a></li>
              <li>Crisis Line: <a href="tel:988" className="hover:text-green-400">988</a></li>
              <li>Crisis Text: <a href="sms:741741" className="hover:text-green-400">741741</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-green-400">Contact Us</h4>
            <p className="text-gray-300 text-sm">
              Email: support@mindconnect.org<br />
              For immediate help, please contact emergency services.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 MindConnect. Supporting SDG 3: Good Health and Well-being.</p>
          <p className="mt-2">If you're experiencing a mental health emergency, please contact emergency services immediately.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
