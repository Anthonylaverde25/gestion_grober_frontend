import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled, useTheme } from '@mui/material/styles';

const Watermark = styled('div')(() => ({
  position: 'absolute',
  bottom: '-20px',
  right: '20px',
  width: '280px', // Smaller watermark
  height: 'auto',
  zIndex: 0,
  pointerEvents: 'none',
  opacity: 0.04,
  '& img': {
    width: '100%',
    height: 'auto',
    filter: 'grayscale(1)',
  }
}));

const ContentContainer = styled(motion.div)(({ theme }) => ({
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  maxWidth: 450, // More compact
  width: '100%',
  zIndex: 1,
}));

type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  showWatermark?: boolean;
};

export default function EmptyState({ icon, title, description, actionText, onAction, showWatermark = true }: EmptyStateProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box className="relative flex flex-col items-start justify-start w-full pt-2 pb-16 overflow-hidden">
      {showWatermark && (
        <Watermark>
          <img 
            src={isDark ? "/assets/images/logo/rxna_full_logo_dark.svg" : "/assets/images/logo/rxna_full_logo.svg"} 
            alt="Watermark" 
          />
        </Watermark>
      )}

      <ContentContainer
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box 
          className="mb-6 flex items-center justify-center w-12 h-12 rounded-lg"
          sx={{ 
            color: 'primary.main',
            bgcolor: (theme) => isDark ? 'rgba(14, 165, 233, 0.08)' : 'rgba(14, 165, 233, 0.04)',
            border: `1px solid ${isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.08)'}`,
          }}
        >
          <FuseSvgIcon size={24}>{icon}</FuseSvgIcon>
        </Box>
        
        <Typography 
            variant="h5" 
            className="font-black mb-2 tracking-tighter uppercase" 
            sx={{ color: isDark ? 'white' : '#0f172a', fontSize: '20px' }}
        >
          {title}
        </Typography>
        
        <Typography 
            variant="body2" 
            className="mb-8 opacity-50 max-w-xs font-medium leading-relaxed"
            sx={{ color: theme.palette.text.secondary }}
        >
          {description}
        </Typography>

        {actionText && onAction && (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={onAction}
            startIcon={<FuseSvgIcon size={16}>heroicons-outline:play</FuseSvgIcon>}
            sx={{ 
                borderRadius: '6px', 
                px: 3, 
                py: 0.8,
                fontWeight: 800, 
                textTransform: 'none',
                boxShadow: 'none',
                fontSize: '13px'
            }}
          >
            {actionText}
          </Button>
        )}
      </ContentContainer>
    </Box>
  );
}
