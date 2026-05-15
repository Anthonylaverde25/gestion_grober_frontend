import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'motion/react';

const WatermarkWrapper = styled(motion.div)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  opacity: 0.19,
  pointerEvents: 'none',
  '& img': {
    width: '450px',
    height: 'auto',
    filter: 'grayscale(1)',
  }
}));

export default function WatermarkView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box className="flex flex-col items-center justify-center w-full h-full min-h-[600px]">
      <WatermarkWrapper
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src={isDark ? "/assets/images/logo/rxna_full_logo_dark.svg" : "/assets/images/logo/rxna_full_logo.svg"}
          alt="RXNA Glass Watermark"
        />
      </WatermarkWrapper>
    </Box>
  );
}
