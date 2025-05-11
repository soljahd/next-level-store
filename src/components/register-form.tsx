'use client';
import { Box, Checkbox, FormControlLabel, Grid, TextField, Typography, Button, Link } from '@mui/material';
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import AddressForm from './address-form';

export default function RegisterForm() {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [isBillingSameAsDelivery, setIsBillingSameAsDelivery] = React.useState(true);
  const [isDefaultDeliveryAddress, setDefaultDeliveryAddress] = React.useState(true);
  const [isDefaultBillingAddress, setDefaultBillingAddress] = React.useState(true);

  return (
    <Box
      component="div"
      maxWidth="md"
      justifyContent="center"
      sx={{
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 1,
      }}
    >
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
        Registration
      </Typography>
      <Typography component="p" color="textSecondary" sx={{ textAlign: 'center' }}>
        Welcome user, please sign up to continue
      </Typography>
      <Box component="form" sx={{ width: '90%', display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
        <Typography component="p" sx={{ textAlign: 'start' }}>
          User
        </Typography>
        <Grid container spacing={2} maxWidth="md" sx={{ margin: '0 auto 10px' }}>
          <Grid size={{ xs: 12, sm: 6, md: 9 / 2 }}>
            <TextField type="text" fullWidth required label="First name" variant="outlined" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 9 / 2 }}>
            <TextField type="text" fullWidth required label="Last name" variant="outlined" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }} flexGrow={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birth date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                minDate={dayjs(new Date('1925-01-01'))}
                maxDate={dayjs()}
                shouldDisableDate={(date) => {
                  const dayOfWeek = date.day();
                  return dayOfWeek === 0 || dayOfWeek === 6;
                }}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth required label="Email" variant="outlined" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField type="password" fullWidth required label="Password" variant="outlined" />
          </Grid>
        </Grid>
        <AddressForm
          addressForWhat={'Delivery address'}
          isDefaultAddress={isDefaultDeliveryAddress}
          handleDefaultAddress={setDefaultDeliveryAddress}
        ></AddressForm>
        <FormControlLabel
          control={
            <Checkbox
              checked={isBillingSameAsDelivery}
              onChange={(event) => setIsBillingSameAsDelivery(event.target.checked)}
              sx={{ p: 0, pl: 1, pr: 1 / 2 }}
            />
          }
          labelPlacement="end"
          label="Use delivery address as billing address"
          sx={{ mb: 1 }}
        ></FormControlLabel>
        {isBillingSameAsDelivery ? (
          ''
        ) : (
          <AddressForm
            addressForWhat={'Billing address'}
            isDefaultAddress={isDefaultBillingAddress}
            handleDefaultAddress={setDefaultBillingAddress}
          ></AddressForm>
        )}
        <Button type="submit" variant="contained" sx={{ alignSelf: 'center', width: '30%' }}>
          Register
        </Button>
        <Box sx={{ alignSelf: 'center', display: 'flex', gap: 1 / 2, alignItems: 'center' }}>
          <Typography component="span" color="textSecondary">
            Do you have an account?
          </Typography>
          <Link href="/login" underline="always">
            Sign In
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
