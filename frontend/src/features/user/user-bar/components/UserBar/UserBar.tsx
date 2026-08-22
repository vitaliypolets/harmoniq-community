import Image from "next/image";
import css from "../../../../../components/Header/Header.module.css";
import type { User } from "@/types/user";

type UserBarProps = {
  user: User | null;
  setIsLogoutOpen: (isOpen: boolean) => void;
  setIsUserModalOpen: (isOpen: boolean) => void;
  userField: string;
};

export default function UserBar({
  user,
  setIsLogoutOpen,
  setIsUserModalOpen,
  userField,
}: UserBarProps) {
  return (
    <li className={css[userField]}>
      <div className={css.userFieldFirst} onClick={() => setIsUserModalOpen(true)}>
        <button type="button" className={css.avatarLink} aria-label="Change avatar">
          <Image
            className={css.userAvatar}
            src={user?.avatarUrl || "/images/default-avatar.png"}
            width={40}
            height={40}
            alt={user?.name || "User avatar"}
          />
        </button>

        <p className={css.userName}>{user?.name}</p>
      </div>

      <button
        type="button"
        onClick={() => setIsLogoutOpen(true)}
        className={css.logoutButton}
        aria-label="Log out"
      >
        <svg className={css.iconLogout}>
          <use href="/icons/sprite.svg#icon-log-out" />
        </svg>
      </button>
    </li>
  );
}
