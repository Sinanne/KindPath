import React from 'react';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      padding: '20px 0',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          textDecoration: 'none',
          color: 'inherit'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
          }}>
            <Rocket color="white" size={24} />
          </div>
          <span style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            fontFamily: 'Fredoka',
            color: '#1E293B'
          }}>
            KindPath
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/math" className="font-fun" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Math</Link>
          <Link to="/science" className="font-fun" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Science</Link>
          <Link to="/english" className="font-fun" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>English</Link>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#E2E8F0',
            overflow: 'hidden',
            marginLeft: '10px'
          }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
