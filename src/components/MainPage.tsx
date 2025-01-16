import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';

interface MainPageProps {
  onSelectUser: (userId: string) => void;
}

const MainPage: React.FC<MainPageProps> = ({ onSelectUser }) => {
  const navigate = useNavigate();

  const users = ['שביט', 'ארבל'];

  const handleSelectUser = (user: string) => {
    onSelectUser(user); // הגדרת המשתמש הנבחר
    navigate(`/blessing-list/${user}`); // ניווט לדף רשימת הברכות עם userId כפרמטר ב-URL
  };

  return (
    <div className='main-page'>
      <h1>בחר משתמש</h1>
      {users.map((user) => (
        <button key={user} onClick={() => handleSelectUser(user)}>
          {user}
        </button>
      ))}
    </div>
  );
};

export default MainPage;
