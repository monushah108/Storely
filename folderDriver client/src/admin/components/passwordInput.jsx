import { FaEye, FaEyeSlash } from "react-icons/fa";

export function PasswordField({
  label,
  name,
  value,
  visible,
  onChange,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-gray-500">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-gray-300 focus:border-gray-400"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
        >
          {visible ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
        </button>
      </div>
    </div>
  );
}
