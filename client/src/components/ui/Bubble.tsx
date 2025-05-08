export const Bubble = ({
  text,
  variant = "primary",
}: {
  text: string;
  variant?: string;
}) => <span className={`badge bg-${variant} rounded-pill me-1`}>{text}</span>;
