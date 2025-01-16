import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/BlessingList.css';
import { brachot, brachotWithIcon } from '../export';
import { updateBlessingDataRead } from '../firebase';

const BlessingListPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    
    try {
      await Promise.all(
        brachot.map(blessing => updateBlessingDataRead(userId, blessing, true))
      );
    } catch (error) {
      console.error('Error marking blessings as read:', error);
    }
  };

  return (
    <div className="blessing-list">
      <h1>רשימת ברכות ל{userId}</h1>
      <ul>
        {brachotWithIcon.map(({ name, icon }) => (
          <li key={name}>
            <Link to={`/bless/${userId}/${name}`}>
              {icon} {name}
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={handleMarkAllAsRead}>
        תתן לי לקרוא הכל
      </button>
    </div>
  );
};

export default BlessingListPage;