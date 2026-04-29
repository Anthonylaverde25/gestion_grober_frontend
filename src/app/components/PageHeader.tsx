import Typography from '@mui/material/Typography';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { motion } from 'motion/react';
import Divider from '@mui/material/Divider';
import useUser from '@auth/useUser';
import useAuth from '@fuse/core/FuseAuthProvider/useAuth';

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	actions?: React.ReactNode;
}

/**
 * Page Header component with SAP Fiori Horizon aesthetic.
 * Clean, spacious, and focused on information hierarchy.
 */
function PageHeader(props: PageHeaderProps) {
	const { title, subtitle, actions } = props;

	return (
		<div className="flex flex-col flex-0 bg-card shadow-sm border-b-1">
			<div className="flex flex-col w-full p-5">
				{/* Top section: Breadcrumbs */}
				<motion.div
					initial={{ y: -10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1 }}
					className="mb-8"
				>
					<PageBreadcrumb
						className="border-0 p-0 bg-transparent"
						borderColor="transparent"
					/>
				</motion.div>

				{/* Middle section: Title and Actions */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-16">
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="flex flex-col min-w-0"
					>
						<Typography className="text-28 md:text-32 font-bold tracking-tight text-[#1d2d3e] leading-tight">
							{title}
						</Typography>

						{subtitle && (
							<Typography
								className="text-14 md:text-16 font-normal text-[#516171] mt-4"
							>
								{subtitle}
							</Typography>
						)}
					</motion.div>

					{actions && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3 }}
							className="flex items-center gap-8"
						>
							{actions}
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}

export default PageHeader;
