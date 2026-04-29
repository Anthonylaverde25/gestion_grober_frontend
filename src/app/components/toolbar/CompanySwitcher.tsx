import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Domain";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useBusiness } from "@/app/contexts/BusinessContext";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * CompanySwitcher Component
 * Professional minimalist design. Now powered by BusinessContext.
 */
export default function CompanySwitcher() {
  const { activeCompany, availableCompanies, switchCompany, isLoadingContext } = useBusiness();

  if (availableCompanies.length === 0) {
    return null;
  }

  const handleChange = async (event: SelectChangeEvent) => {
    const newId = event.target.value;
    await switchCompany(newId);
  };

  return (
    <Box 
      className="flex items-center px-4 h-full transition-colors duration-200 border-x border-transparent hover:bg-action-hover"
      sx={{ 
        minWidth: 200,
        maxWidth: 300,
        borderLeftColor: 'divider',
        borderRightColor: 'divider',
      }}
    >
      <Box className="flex items-center justify-center mr-3 opacity-40">
        {isLoadingContext ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <BusinessIcon sx={{ fontSize: 18 }} />
        )}
      </Box>

      <Box className="flex flex-col flex-1 min-w-0 py-2">
        <Typography 
          className="font-semibold tracking-wider opacity-50 uppercase" 
          sx={{ 
            fontSize: '0.6rem',
            color: 'text.secondary',
            lineHeight: 1.2
          }}
        >
          Organización
        </Typography>
        
        <FormControl variant="standard" fullWidth>
          <Select
            labelId="company-switcher-label"
            id="company-switcher"
            value={activeCompany?.id || ""}
            onChange={handleChange}
            disableUnderline
            disabled={isLoadingContext}
            IconComponent={ExpandMoreIcon}
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 1,
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                  border: '1px solid',
                  borderColor: 'divider',
                }
              }
            }}
            sx={{
              fontWeight: 600,
              fontSize: 13,
              fontFamily: 'var(--fuse-font-family, "Inter", "system-ui", sans-serif)',
              "& .MuiSelect-select": {
                paddingY: 0,
                paddingRight: '24px !important',
                display: "flex",
                alignItems: "center",
                color: 'text.primary',
              },
              "& .MuiSvgIcon-root": {
                fontSize: 16,
                color: 'text.disabled',
                right: -4,
              }
            }}
          >
            {availableCompanies.map((company) => (
              <MenuItem 
                key={company.id} 
                value={company.id}
                sx={{
                  py: 1.25,
                  px: 2,
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.1s',
                  "&.Mui-selected": {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    color: 'primary.main',
                    fontWeight: 700,
                    borderLeft: '3px solid',
                    borderLeftColor: 'primary.main',
                    "&:hover": {
                      backgroundColor: 'rgba(0, 0, 0, 0.06)',
                    }
                  },
                  "&:hover": {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              >
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
