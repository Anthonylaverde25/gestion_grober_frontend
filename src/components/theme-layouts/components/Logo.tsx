import { styled, useTheme } from '@mui/material/styles';
import clsx from 'clsx';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

type LogoProps = {
	className?: string;
};

/**
 * The logo component.
 */
function Logo(props: LogoProps) {
	const { className = '' } = props;
	const theme = useTheme();

	return (
		<Root className={clsx('flex flex-shrink-0 flex-grow items-center', className)}>
			<div className="flex items-center w-full">
				<img
					className="logo-icon h-24 w-auto object-contain"
					src={theme.palette.mode === 'dark' ? '/assets/images/logo/rxna_full_logo_dark.svg' : '/assets/images/logo/rxna_full_logo.svg'}
					alt="RXNA GLASS"
				/>
			</div>
		</Root>
	);
}

export default Logo;
