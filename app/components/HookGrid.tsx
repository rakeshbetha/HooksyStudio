import HookCard, { HookItem } from "./HookCard";

type Props = {
  items: HookItem[];
  onShow: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, next: boolean) => void;
  emptyHint?: string;
};

export default function HookGrid({ items, onShow, onEdit, onDelete, onTogglePin, emptyHint }: Props) {
  if (!items?.length) {
    return (
      <div style={{
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '32px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        {emptyHint ?? "No hooks yet — generate your first hook!"}
      </div>
    );
  }
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      padding: '16px'
    }}>
      {items.map(item => (
        <HookCard
          key={item.id}
          item={item}
          onShow={onShow}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
} 