import React from 'react';
import { motion } from 'framer-motion';
import { useSignals } from '@preact/signals-react/runtime';
import { 
  Palette, 
  Bell, 
  Shield, 
  Database, 
  User, 
  Globe,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { themeMode, setTheme } from '@/store/signals';

const Settings: React.FC = () => {
  useSignals();

  const settingSections = [
    {
      title: 'Appearance',
      description: 'Customize the look and feel',
      icon: Palette,
      settings: [
        {
          label: 'Theme',
          description: 'Choose your preferred theme',
          component: (
            <div className="flex items-center space-x-2">
              <Button
                variant={themeMode.value === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={themeMode.value === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={themeMode.value === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
              >
                <Monitor className="mr-2 h-4 w-4" />
                System
              </Button>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      settings: [
        {
          label: 'Email Notifications',
          description: 'Receive updates via email',
          component: (
            <Badge variant="success">Enabled</Badge>
          ),
        },
        {
          label: 'Low Stock Alerts',
          description: 'Get notified when products are running low',
          component: (
            <Badge variant="success">Enabled</Badge>
          ),
        },
      ],
    },
    {
      title: 'Security',
      description: 'Account security settings',
      icon: Shield,
      settings: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          component: (
            <Badge variant="outline">Not Configured</Badge>
          ),
        },
        {
          label: 'API Keys',
          description: 'Manage API access keys',
          component: (
            <Button variant="outline" size="sm">
              Manage
            </Button>
          ),
        },
      ],
    },
    {
      title: 'Data Management',
      description: 'Import, export, and backup your data',
      icon: Database,
      settings: [
        {
          label: 'Export Data',
          description: 'Download your product catalog',
          component: (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export Products
              </Button>
              <Button variant="outline" size="sm">
                Export Categories
              </Button>
            </div>
          ),
        },
        {
          label: 'Import Data',
          description: 'Import from CSV or Excel files',
          component: (
            <Button variant="outline" size="sm">
              Import
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and account settings
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.settings.map((setting, settingIndex) => (
                    <div
                      key={setting.label}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{setting.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        {setting.component}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Clear All Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete all products and categories
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Clear Data
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Reset Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Reset all settings to default values
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;