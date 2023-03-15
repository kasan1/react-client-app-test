import React from 'react';
import Box from '@material-ui/core/Box';

interface IProps {
  value: number;
  index: number;
  children?: React.ReactNode;
  className?: string | undefined;
}

const TabPanel: React.FC<IProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
