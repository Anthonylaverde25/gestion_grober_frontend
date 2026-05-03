import { axiosInstance } from '@/app/di/container';
import { useMutation } from '@tanstack/react-query';

export interface UserAlias {
  id: string;
  name: string;
  legajo: string;
}

export function useUserAlias() {
  const searchAlias = async (legajo: string): Promise<UserAlias> => {
    const response = await axiosInstance.get(`/api/v1/user-aliases/search`, {
      params: { legajo }
    });
    return response.data.data;
  };

  const { mutateAsync: searchAliasMutation, isPending: isSearching } = useMutation({
    mutationFn: searchAlias,
  });

  return {
    searchAlias: searchAliasMutation,
    isSearching,
  };
}
