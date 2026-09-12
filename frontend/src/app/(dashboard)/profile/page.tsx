import { UserProfileCard } from '@/features/auth/components/UserProfileCard';

export const metadata = {
  title: 'Profile Settings — EventSphere AI Enterprise',
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account & Profile Settings</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Manage user credentials and tenant workspace settings</p>
      </div>
      <UserProfileCard />
    </div>
  );
}
