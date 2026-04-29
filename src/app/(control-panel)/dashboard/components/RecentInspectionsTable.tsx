import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface InspectionRowProps {
    id: string;
    time: string;
    inspector: string;
    defect: string;
    action: string;
    status: string;
    bgColor: string;
    textColor: string;
}

function InspectionRow({ id, time, inspector, defect, action, status, bgColor, textColor }: InspectionRowProps) {
    return (
        <TableRow sx={{ '&:hover': { backgroundColor: '#f8f9fb' } }}>
            <TableCell sx={{ py: 1.5, px: 3, fontSize: 13, fontWeight: 600, color: '#191c1e', border: 'none' }}>{id}</TableCell>
            <TableCell sx={{ py: 1.5, px: 3, fontSize: 13, color: '#4e6070', border: 'none' }}>{time}</TableCell>
            <TableCell sx={{ py: 1.5, px: 3, fontSize: 13, color: '#191c1e', border: 'none' }}>{inspector}</TableCell>
            <TableCell sx={{ py: 1.5, px: 3, fontSize: 13, color: '#191c1e', border: 'none' }}>{defect}</TableCell>
            <TableCell sx={{ py: 1.5, px: 3, fontSize: 13, color: '#191c1e', border: 'none' }}>{action}</TableCell>
            <TableCell sx={{ py: 1.5, px: 3, border: 'none' }}>
                <Box sx={{ backgroundColor: bgColor, color: textColor, px: 1, py: 0.25, borderRadius: 10, fontSize: 11, fontWeight: 600, display: 'inline-block' }}>
                    {status}
                </Box>
            </TableCell>
        </TableRow>
    );
}

export default function RecentInspectionsTable() {
    return (
        <Paper sx={{ mt: 2, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #c1c6d7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#191c1e' }}>Recent Quality Inspections</Typography>
                <Box sx={{ width: 200 }}>
                    <input 
                        placeholder="Search batch..." 
                        style={{ 
                            width: '100%', 
                            padding: '6px 12px', 
                            fontSize: '13px', 
                            backgroundColor: '#f8f9fb', 
                            border: '1px solid #c1c6d7', 
                            borderRadius: '4px',
                            outline: 'none'
                        }} 
                    />
                </Box>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: '#eceef0' }}>
                        <TableRow>
                            {['Section/Mold', 'Timestamp', 'Inspector/Machine', 'Primary Defect', 'Action Taken', 'Status'].map(h => (
                                <TableCell key={h} sx={{ fontSize: 13, fontWeight: 700, color: '#414754', py: 1.5, px: 3, border: 'none' }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ '& tr:not(:last-child)': { borderBottom: '1px solid #c1c6d7' } }}>
                        <InspectionRow id="IS-01 / M-12" time="10:45 AM" inspector="Line Scan A1" defect="Wall Thickness (Base)" action="Diverted to Recalibration" status="Warning" bgColor="#d2e5f8" textColor="#374958" />
                        <InspectionRow id="IS-01 / M-08" time="10:52 AM" inspector="R. Thompson" defect="None" action="Proceed to Packaging" status="Verified" bgColor="#d8e2ff" textColor="#004396" />
                        <InspectionRow id="IS-02 / M-03" time="11:05 AM" inspector="Auto-Inspector 4" defect="Critical Check (Neck)" action="Immediate Cullet Scrap" status="Rejected" bgColor="#ffdad6" textColor="#93000a" />
                        <InspectionRow id="IS-02 / M-15" time="11:12 AM" inspector="R. Thompson" defect="Optical Seed" action="Manual Re-inspection" status="Warning" bgColor="#d2e5f8" textColor="#374958" />
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
