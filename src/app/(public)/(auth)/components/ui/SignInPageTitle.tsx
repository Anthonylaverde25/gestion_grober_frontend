import Typography from '@mui/material/Typography';

function SignInPageTitle() {
	return (
		<div className="w-full flex flex-col items-center justify-center text-center">
			<img
				className="w-[500px] mb-4"
				src="/assets/images/logo/rxna_full_logo.svg"
				alt="RXNA Glass Logo"
			/>
			<div className="w-32 h-1 bg-secondary-main rounded-full opacity-50 mb-10" />
		</div>
	);
}

export default SignInPageTitle;
