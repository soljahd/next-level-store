import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import AddressForm from '../components/register-form/address-form';
import type { RegisterFormData } from '@/lib/validation';

type Props = {
  prefix: 'shippingAddress' | 'billingAddress';
  errors?: Partial<Record<keyof RegisterFormData['shippingAddress'], { message: string }>>;
};

const Wrapper = ({ prefix, errors = {} }: Props) => {
  const methods = useForm<RegisterFormData>({
    defaultValues: {
      shippingAddress: {
        country: '',
        city: '',
        streetName: '',
        postalCode: '',
        isDefault: false,
      },
      billingAddress: {
        country: '',
        city: '',
        streetName: '',
        postalCode: '',
        isDefault: false,
      },
    },
  });

  return (
    <FormProvider {...methods}>
      <AddressForm addressForWhat="Shipping address" control={methods.control} errors={errors} prefix={prefix} />
    </FormProvider>
  );
};

describe('AddressForm component', () => {
  it('renders all form fields correctly', () => {
    render(<Wrapper prefix="shippingAddress" />);

    expect(screen.getByText('Shipping address')).toBeInTheDocument();
    expect(screen.getByLabelText('Set default')).toBeInTheDocument();

    const comboBoxes = screen.getAllByRole('combobox');
    expect(comboBoxes[0]).toBeInTheDocument();

    expect(screen.getByLabelText('City*')).toBeInTheDocument();
    expect(screen.getByLabelText('Street*')).toBeInTheDocument();
    expect(screen.getByLabelText('Postcode*')).toBeInTheDocument();
  });

  it('displays error messages when provided', () => {
    render(
      <Wrapper
        prefix="billingAddress"
        errors={{
          country: { message: 'Country is required' },
          city: { message: 'City is required' },
        }}
      />,
    );

    expect(screen.getByText('Country is required')).toBeInTheDocument();
    expect(screen.getByText('City is required')).toBeInTheDocument();
  });

  it('switch is checked by default if defaultValue is true', () => {
    const ComponentWithDefault = () => {
      const methods = useForm<RegisterFormData>({
        defaultValues: {
          shippingAddress: {
            country: '',
            city: '',
            streetName: '',
            postalCode: '',
            isDefault: true,
          },
          billingAddress: {
            country: '',
            city: '',
            streetName: '',
            postalCode: '',
            isDefault: false,
          },
        },
      });

      return (
        <FormProvider {...methods}>
          <AddressForm addressForWhat="Shipping" control={methods.control} errors={{}} prefix="shippingAddress" />
        </FormProvider>
      );
    };

    render(<ComponentWithDefault />);
    const switchInput = screen.getByLabelText<HTMLInputElement>('Set default');
    expect(switchInput.checked).toBe(true);
  });
});
