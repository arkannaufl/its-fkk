import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import ChangePasswordCard from "../components/UserProfile/ChangePasswordCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Pengaturan Akun | ITS (Integrated Task System)"
        description="Kelola informasi profil pengguna, ubah data pribadi, dan ganti password di ITS (Integrated Task System)"
      />
      <PageBreadcrumb pageTitle="Pengaturan Akun" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profil
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <ChangePasswordCard />
        </div>
      </div>
    </>
  );
}

