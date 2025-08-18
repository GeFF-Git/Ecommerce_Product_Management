import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useSignals } from '@preact/signals-react/runtime';
import { isDarkMode, toggleTheme } from '@/store/signals';

const Settings: React.FC = () => {
  useSignals();
  const theme = useTheme();

  const settingSections = [
    {
      title: 'Appearance',
      icon: PaletteIcon,
      settings: [
        {
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          value: isDarkMode.value,
          onChange: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: NotificationsIcon,
      settings: [
        {
          label: 'Email Notifications',
          description: 'Receive email updates about your products',
          value: true,
          onChange: () => {},
        },
        {
          label: 'Low Stock Alerts',
          description: 'Get notified when products are running low',
          value: true,
          onChange: () => {},
        },
      ],
    },
    {
      title: 'Security',
      icon: SecurityIcon,
      settings: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          value: false,
          onChange: () => {},
        },
      ],
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          Settings
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Manage your application preferences and account settings.
        </Typography>
      </Box>

      {/* Settings Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {settingSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="card-hover">
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <section.icon sx={{ color: theme.palette.primary.main }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {section.title}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.settings.map((setting, settingIndex) => (
                  <React.Fragment key={settingIndex}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            mb: 0.5,
                          }}
                        >
                          {setting.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {setting.description}
                        </Typography>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={setting.value}
                            onChange={setting.onChange}
                            color="primary"
                          />
                        }
                        label=""
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    {settingIndex < section.settings.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Data Management */}
        <Card className="card-hover">
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <StorageIcon sx={{ color: theme.palette.warning.main }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Data Management
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  Export Data
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 2,
                  }}
                >
                  Download your product catalog and category data
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Export Products
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                >
                  Export Categories
                </Button>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.error.main,
                    mb: 1,
                  }}
                >
                  Danger Zone
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 2,
                  }}
                >
                  Irreversible actions that will affect your data
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                >
                  Clear All Data
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Settings;