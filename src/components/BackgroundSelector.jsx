import React from 'react';
import '../styles/BackgroundSelector.css';

const BACKGROUNDS = [
  { name: 'Aurora', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732504320/ufo9ylxhpfylpxis4oyu.jpg' },
  { name: 'Montaña Niebla', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732561558/qt3993rfxrftmejlmitf.jpg' },
  { name: 'Lago Reflejo', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732504320/dzrmk1nbamuvnrlrzkjq.jpg' },
  { name: 'Cielo Nocturno', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732561044/pqyyelvqbu4vtbbe8svq.jpg' },
  { name: 'Playa Rocosa', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732561368/a2hecjesr0efnjkedisf.jpg' },
  { name: 'Blanco', color: '#ffffff', isLight: true },
  { name: 'Negro', color: '#000000', isLight: false },
  { name: 'Púrpura', color: '#4e458d', isLight: false },
  { name: 'Verde', color: '#609f14', isLight: true },
  { name: 'Magenta', color: '#c112b6', isLight: false },
];

const BackgroundSelector = ({ onBackgroundChange }) => {
  const handleBackgroundChange = (background) => {
    onBackgroundChange({
      url: background.url || '',
      color: background.color || '',
      isLight: background.isLight,
    });
  };

  return (
    <div className="background-selector-container">
        {BACKGROUNDS.map((bg, index) => (
            <button
            key={index}
            className={`background-button ${bg.isLight ? 'light' : 'dark'}`}
            style={{
                backgroundColor: bg.color || 'transparent',
                backgroundImage: bg.url ? `url(${bg.url})` : 'none',
            }}
            onClick={() => onBackgroundChange(bg)}
            >
            {bg.url ? (
                <img src={bg.url} alt={bg.name} />
            ) : (
                <span>{bg.name}</span>
            )}
            </button>
    ))}
    </div>

  );
};

export default BackgroundSelector;
