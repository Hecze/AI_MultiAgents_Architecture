// src/components/PersonalitySlider.tsx

import React, { useState } from "react";

interface PersonalitySliderProps {
  tag: string;
  options: string[];
}

const PersonalitySlider: React.FC<PersonalitySliderProps> = ({
  tag,
  options,
}) => {
  const [personality, setPersonality] = useState(options[1]); // Iniciar con la opción central por defecto

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setPersonality(options[value]);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <input
        type="range"
        min="0"
        max={options.length - 1}
        value={options.indexOf(personality)}
        onChange={handleChange}
        className="slider w-72 appearance-none bg-gray-400 h-1 rounded-full mt-3 outline-none"
      />
      <p className="text-xl mt-3"><b>{tag}</b>: {personality}</p>
    </div>
  );
};

export default PersonalitySlider;