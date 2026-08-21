import { PasswordField } from "./passwordInput";

export default function SettingForm({
  handlePasswordChange,
  handlePasswordSubmit,
  passwords,
  showPassword,
  changingPassword,
  hasPassword,
}) {
  return (
    <form onSubmit={handlePasswordSubmit} className="p-5">
      <div
        className={`grid gap-5 ${
          hasPassword ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {/* Current password only when password exists */}
        {hasPassword && (
          <PasswordField
            label="Current password"
            name="currentPassword"
            value={passwords.currentPassword}
            visible={showPassword.current}
            onChange={handlePasswordChange}
            onToggle={() => togglePassword("current")}
          />
        )}

        <PasswordField
          label="New password"
          name="newPassword"
          value={passwords.newPassword}
          visible={showPassword.new}
          onChange={handlePasswordChange}
          onToggle={() => togglePassword("new")}
        />

        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          visible={showPassword.confirm}
          onChange={handlePasswordChange}
          onToggle={() => togglePassword("confirm")}
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={changingPassword}
          className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {changingPassword
            ? hasPassword
              ? "Changing..."
              : "Setting..."
            : hasPassword
              ? "Change Password"
              : "Set Password"}
        </button>
      </div>
    </form>
  );
}
