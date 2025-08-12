import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';
import { SubmitBtn } from '../components/SubmitBtn';
import { useForm } from 'react-hook-form';
import { api } from '../utils/api';
import { getErrorMessage } from '../utils';

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const response = await api.post('/users/register', data);
      if (response.status !== 201 || !response.data) {
        throw new Error('Registration failed');
      }
      toast.success('User registered successfully');
      navigate('/login');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };
  return (
    <section className="h-screen grid place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card w-96 p-8 bg-base-200 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>
        <FormInput
          type="text"
          label="Username"
          name="username"
          register={register}
          validationSchema={{
            required: 'username is required',
            minLength: {
              value: 3,
              message: 'Please enter a minimum of 3 characters',
            },
          }}
          error={errors.username}
        />
        <FormInput
          type="email"
          label="Email"
          name="email"
          register={register}
          validationSchema={{
            required: 'email is required',
          }}
          error={errors.email}
        />
        <FormInput
          type="password"
          label="Password"
          name="password"
          register={register}
          validationSchema={{
            required: 'username is required',
            minLength: {
              value: 3,
              message: 'Please enter a minimum of 3 characters',
            },
          }}
          error={errors.password}
        />
        <div className="mt-4">
          <SubmitBtn text="Register" />
        </div>
        <p className="text-center">
          Already a member?
          <Link
            to="/login"
            className="ml-2 link link-hover link-primary capitalize"
          >
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};
export default Register;
