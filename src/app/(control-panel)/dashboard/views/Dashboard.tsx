import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'motion/react';
import Box from '@mui/material/Box';
import PageHeader from '@/app/components/PageHeader';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

// Components
import DashboardSubheader from '../components/DashboardSubheader';
import SummaryView from './sections/SummaryView';
import BoardsView from './sections/BoardsView';
import YieldView from './sections/YieldView';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {
        backgroundColor: theme.palette.background.paper,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.divider,
    },
    '& .FusePageSimple-content': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: theme.palette.background.default
    }
}));

const container = {
    show: {
        transition: {
            staggerChildren: 0.1
        }
    },
    hidden: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

/**
 * Dashboard Component
 * Standardized with corporate PageHeader format from Articles.
 * Optimized for Dark Mode.
 */
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState(0);
    const theme = useTheme();

    return (
        <Root
            header={
                <PageHeader
                    title={<Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Dashboard</Typography>}
                    subtitle="Gestión Grober - Sistema Operativo"
                />
            }
            content={
                <motion.div
                    className="flex flex-col w-full"
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{ color: theme.palette.text.primary }}
                >
                    <DashboardSubheader activeTab={activeTab} setActiveTab={setActiveTab} />

                    <Box sx={{ width: '100%', px: { xs: 3, sm: 4 }, pb: 8 }}>
                        {(() => {
                            switch (activeTab) {
                                case 0: return <SummaryView />;
                                case 1: return <BoardsView />;
                                case 2: return <YieldView />;
                                default: return <SummaryView />;
                            }
                        })()}
                    </Box>
                </motion.div>
            }
        />
    );
}
