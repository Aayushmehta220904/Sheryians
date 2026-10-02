export default function FieldErrors({ errors, field }) {
  const messages = (errors || []).filter((item) => item.field === field).map((item) => item.message);
  if (!messages.length) return null;
  return <div className="field-errors">{messages.map((message, index) => <span key={`${field}-${index}`}>{message}</span>)}</div>;
}
