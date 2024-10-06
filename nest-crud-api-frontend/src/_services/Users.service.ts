import Axios from './Axios';

export const UserService = {
  getAllUsers: () => Axios.get(`/user`),
  
  getUser: (id: string | number) => Axios.get(`/user/${id}`),
  
  deleteUser: (id: string | number) => Axios.delete(`/user/${id}`),

  createUser: (data: FormData) => Axios.post('/user', data),

  updateUser: (id: string | number, data: FormData) => Axios.patch(`/user/${id}`, data),
};
