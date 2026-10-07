import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import { SystemSettingsConfig } from '../types/settings.types';
import { toast } from 'sonner';

export const useSettingsData = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (config: Partial<SystemSettingsConfig>) => settingsService.updateSettings(config),
    onSuccess: () => {
      toast.success('System settings saved and applied across tenant context!');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    config: settingsQuery.data?.config,
    logs: settingsQuery.data?.logs || [],
    isLoading: settingsQuery.isLoading,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
