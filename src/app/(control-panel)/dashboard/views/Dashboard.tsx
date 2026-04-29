import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'motion/react';
import Box from '@mui/material/Box';
import PageHeader from '@/app/components/PageHeader';
import { useState } from 'react';

// Components
import DashboardSubheader from '../components/DashboardSubheader';
import SummaryView from './sections/SummaryView';
import BoardsView from './sections/BoardsView';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {},
    '& .FusePageSimple-content': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: '#f8f9fb'
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

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Root
            header={
                <PageHeader
                    title="Dashboard"
                    subtitle="Gestión Grober - Sistema Operativo"
                />
            }
            content={
                <motion.div
                    className="flex flex-col w-full"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <DashboardSubheader activeTab={activeTab} setActiveTab={setActiveTab} />

                    <Box sx={{ width: '100%', px: { xs: 3, sm: 4 }, pb: 8 }}>
                        {activeTab === 0 ? <SummaryView /> : <BoardsView />}
                    </Box>
                </motion.div>
            }
        />
    );
}
