import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Button} from "react-bootstrap";
import Tooltip from 'react-bootstrap/Tooltip';
import { isMobile } from 'react-device-detect';

const CategoryWithTooltip = ({ title }) => {
    const initials = title.split(' ').map(word => word[0]).join('');
    const renderCategoryTooltip = (props) => (
      <Tooltip id="button-category-tooltip" {...props}>
        {title}
      </Tooltip>
    );
  
    return (
      <OverlayTrigger
        placement="right"
        delay={{ show: 100, hide: 100 }}
        overlay={renderCategoryTooltip}
      >
        <Button style={{ 
          backgroundColor: 'transparent', 
          border: 'none', 
          color: 'inherit',
          textDecoration: 'none',
          padding: 0,
          margin: 0
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ width: '32px', height: '32px' }}>
            <ellipse cx="50" cy="50" rx="35" ry="25" fill="none" stroke="currentColor" strokeWidth="3"/>
            <text x="50" y="52" fill="currentColor" textAnchor="middle" dominantBaseline="middle" style={{ fontWeight: 'bold', fontSize: '26px' }}>{initials}</text>
          </svg>
        </Button>
      </OverlayTrigger>
    );
  };

const Features = ({ features }) => {
  return (
    <div style={{ display: 'flex'}}>
      {isMobile ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {features.map((feature, index) => (
            <span key={index} style={{ whiteSpace: 'nowrap', fontSize: '12px', marginRight: '5px' }}>
              {feature}
              {index !== features.length - 1 && ' | '}
            </span>
          ))}
        </div>
      ) : (
        <ul style={{ listStyleType: 'none', display: 'flex', gap: '5px', alignItems: 'center', margin: 0, padding: 0 }}>
          {features.map((feature, index) => (
            <li key={index}>
              <CategoryWithTooltip title={feature} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Features;
