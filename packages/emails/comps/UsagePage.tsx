'use client';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Stack
} from '@mui/material';
 
const UsagePage = ({emailUsage, templateUsage, sendersCount, plan}) => {

 
  const upgradePlan = () => {
    // Redirect to the upgrade page or handle the upgrade process
  };
 
  const calculateUsagePercentage = () => {
    return (emailUsage / plan.emailLimit) * 100;
  };
 
 
  return (
    <Box>
      {plan?.isFree && (
        <Card>
          <CardContent>
            <Typography variant="h5">Free Plan</Typography>
            <Typography>
              You are currently on the Free plan, which includes sending 50 emails with our branding.
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={upgradePlan}>
              Upgrade
            </Button>
          </CardActions>
        </Card>
      )}
      <Stack direction="row" spacing={3} my={4}>
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h6">Email Usage</Typography>
        <LinearProgress variant="determinate" value={calculateUsagePercentage()} />
        <Typography>
          {emailUsage} / {plan.emailLimit} emails sent
        </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h6">Template Usage</Typography>
        <LinearProgress variant="determinate" value={calculateUsagePercentage()} />
        <Typography>
          {templateUsage} / {plan.emailTemplates} templates created
        </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h6">Verified Senders</Typography>
        <LinearProgress variant="determinate" value={calculateUsagePercentage()} />
        <Typography>
          {sendersCount} / {plan.verifiedSenders} verified senders created
        </Typography>
        </CardContent>
      </Card>
      </Stack>
    </Box>
  );
};
 
export default UsagePage;