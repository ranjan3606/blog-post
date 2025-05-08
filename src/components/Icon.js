import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Icon = ({ icon, className, onClick, style }) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className || ''}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
    />
  );
};

export default Icon;