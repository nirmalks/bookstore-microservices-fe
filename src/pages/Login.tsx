import { Link, useNavigate } from 'react-router';
import FormInput from '../components/FormInput';
import { SubmitBtn } from '../components/SubmitBtn';
import { toast } from 'react-toastify';
import { loginUser } from '../features/user/userSlice';
import { useForm } from 'react-hook-form';
import { api } from '../utils/api';
import { getErrorMessage } from '../utils';
import { useAppDispatch } from '../store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = new URLSearchParams();

      const clientId = 'local-client';
      const clientSecret = 'secret';
      const credentials = btoa(`${clientId}:${clientSecret}`);
      formData.append('grant_type', 'password');
      formData.append('username', data.username as string);
      formData.append('password', data.password as string);
      formData.append('client_id', 'local-client');
      formData.append('client_secret', 'secret');
      const response = await api.post('/oauth2/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      });
      if (response.status !== 200 || !response.data) {
        throw new Error('Login failed');
      }
      toast.success('User logged in successfully');

      const { access_token, userId, username, role } = response.data;

      const user = {
        token: access_token,
        userId: userId,
        username: username,
        role: role,
      };
      dispatch(loginUser(user));
      navigate('/');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };
  return (
    <section className="h-screen grid place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
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
          type="password"
          label="Password"
          name="password"
          register={register}
          validationSchema={{
            required: 'password is required',
            minLength: {
              value: 3,
              message: 'Please enter a minimum of 3 characters',
            },
          }}
          error={errors.password}
        />
        <div className="mt-4">
          <SubmitBtn text="Login" />
        </div>
        <p className="text-center">
          Not a member yet?{' '}
          <Link
            to="/register"
            className="ml-2 link link-hover link-primary capitalize"
          >
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};
export default Login;
