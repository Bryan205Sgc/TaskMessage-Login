import React from 'react';
import '../styles/BackgroundSelector.css';

const BACKGROUNDS = [
  { name: 'Aurora', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732504320/ufo9ylxhpfylpxis4oyu.jpg' },
  { name: 'Montaña Niebla', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732561558/qt3993rfxrftmejlmitf.jpg' },
  { name: 'Lago Reflejo', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732504320/dzrmk1nbamuvnrlrzkjq.jpg' },
  { name: 'Cielo Nocturno', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732561044/pqyyelvqbu4vtbbe8svq.jpg' },
  { name: 'Playa Rocosa', url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732561368/a2hecjesr0efnjkedisf.jpg' },
  { name: 'Blanco', gradient: 'linear-gradient(to right, #ffffff, #eaeaea)', isLight: true },
  { name: 'Negro', gradient: 'linear-gradient(to right, #000000, #434343)', isLight: false },
  { name: 'Púrpura', gradient: 'linear-gradient(to right, #4e458d, #8a77ff)', isLight: false },
  { name: 'Verde', gradient: 'linear-gradient(to right, #609f14, #a0d36c)', isLight: true },
  { name: 'Magenta', gradient: 'linear-gradient(to right, #c112b6, #f05be6)', isLight: false },
];

const BackgroundSelector = ({ onBackgroundChange, selectedBackground }) => {
  const handleBackgroundChange = (background) => {
    if (
      selectedBackground &&
      selectedBackground.url === background.url &&
      selectedBackground.gradient === background.gradient &&
      selectedBackground.color === background.color
    ) {
      return;
    }

    onBackgroundChange({
      url: background.url || '',
      gradient: background.gradient || '',
      color: background.color || 'transparent',
      isLight: background.isLight || false,
    });
  };

  return (
    <div className="background-selector-container">
      {BACKGROUNDS.map((bg, index) => (
        <button
          key={index}
          className={`background-button ${selectedBackground?.name === bg.name ? 'selected' : ''}`}
          style={{
            background: bg.url
              ? `url(${bg.url})`
              : bg.gradient
              ? bg.gradient
              : bg.color || 'transparent',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onClick={() => handleBackgroundChange(bg)}
        >
          {!bg.url && !bg.gradient && <span>{bg.name}</span>}
        </button>
      ))}
    </div>
  );
};

export default BackgroundSelector;
