import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {brachot,brachotText} from '../export';
import { getBlessingData, updateBlessingData, updateBlessingDataRead } from '../firebase';
import '../styles/BlessPage.css';

const BlessPage: React.FC = () => {
  const { userId, blessing } = useParams<{ userId: string; blessing: string }>(); // Get userId and blessing from the URL

  const [lastTimeRead, setLastTimeRead] = useState<string>('');
  const [canRead, setCanRead] = useState<boolean>(true);

const renderText = (text: string) => {
  return text.split("\n").map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
};



  useEffect(() => {
    const fetchBlessingData = async () => {
      if (userId && blessing) {
        const data = await getBlessingData(userId, blessing);
        if (data) {
          setLastTimeRead(data.lastTimeRead);
          setCanRead(data.isOkToRead);
        }
      }
    };
    fetchBlessingData();
  }, [userId, blessing]);

  const handleRead = async () => {
    if (canRead && userId && blessing) {
      const timestamp = new Date().toISOString();
      if(blessing !== 'אשר יצר'){
        await updateBlessingData(userId, blessing,  false);
        setLastTimeRead(new Date(timestamp).toLocaleString());
        setCanRead(false);
      }
      else{
        await updateBlessingData(userId, blessing,  true);
        setLastTimeRead(new Date(timestamp).toLocaleString());
        setCanRead(true);
      }
    }
    if (canRead && userId && blessing === 'ברכת המזון') {
      const otherBrachot = brachot.filter((bracha) => bracha !== 'ברכת המזון' && bracha !== 'אשר יצר');
      for (const bracha of otherBrachot) {
        await updateBlessingDataRead(userId, bracha, true);
      }
    }



    if (canRead && userId && blessing === 'בורא נפשות') {
      const nefashotClean = ['שהכל', 'עץ', 'אדמה', 'מזונות'];
      for (const bracha of nefashotClean) {
        await updateBlessingDataRead(userId, bracha, true);
      }
    }
    if (canRead && userId && blessing === 'על המחיה') {
      const mezonotClean = ['עץ', 'מזונות', 'גפן'];
      for (const bracha of mezonotClean) {
        await updateBlessingDataRead(userId, bracha, true);
      }
    }

    if (canRead && userId && blessing === 'המוציא') {
      await updateBlessingDataRead(userId, 'ברכת המזון', true);
    }

    if (canRead && userId && (blessing === 'עץ' || blessing === 'אדמה' || blessing === 'שהכל' || blessing === 'מזונות')) {
      await updateBlessingDataRead(userId, 'בורא נפשות', true);
    }

    if (canRead && userId && (blessing === 'גפן' || blessing === 'מזונות' || blessing === 'עץ')) {
      await updateBlessingDataRead(userId, 'על המחיה', true);
    }
  };


  return (
    <div>
      <h1>{blessing}</h1>
     <div>
      {brachotText
        .filter((bracha) => bracha.name === blessing)
        .map((bracha, index) => (
          <React.Fragment key={index}>
        {renderText(bracha.text)}
          </React.Fragment>
        ))}
    </div>
      
      <p>מתי ברכת פעם אחרונה? {lastTimeRead || 'טרם קראת'}</p>
      <p>אפשר לקרוא? {canRead ? 'כן' : 'לא'}</p>
      <button onClick={handleRead} disabled={!canRead}>ברכתי!</button>
    </div>
  );
};

export default BlessPage;
