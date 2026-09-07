import { initials, avatarColor } from "../utils/format";

// Círculo con iniciales y color estable, derivado del nombre del cliente.
export default function Avatar({ firstName, lastName, size = 34 }) {
  const label = initials(firstName, lastName);
  const bg = avatarColor(`${firstName} ${lastName}`);
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
